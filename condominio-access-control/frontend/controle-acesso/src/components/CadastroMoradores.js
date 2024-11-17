import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import * as faceapi from 'face-api.js';

const MODEL_URL = '/models'; // URL onde os modelos de reconhecimento facial estão armazenados

const CadastroMoradores = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [imagem, setImagem] = useState(null);
  const [erro, setErro] = useState('');

  // Carrega os modelos de reconhecimento facial ao montar o componente
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      startVideo();
    };
    loadModels();
  }, []);

  // Função para iniciar o vídeo da câmera
  const startVideo = async () => {
    const video = document.getElementById('videoElement');
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
  };

  // Função para detectar e reconhecer rostos
  const detectAndRecognize = async () => {
    const video = document.getElementById('videoElement');
    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks().withFaceDescriptors();

      const results = detections.map(d => faceMatcher.findBestMatch(d.descriptor));
      results.forEach((result) => {
        if (result.label === 'unknown') {
          console.log('Acesso Negado');
        } else {
          console.log('Acesso Permitido:', result.label);
        }
      });
    }, 1000);
  };

  // Função para carregar as imagens dos moradores para comparação
  const loadLabeledImages = async () => {
    const labels = ['Morador1', 'Morador2']; // Nomes dos moradores cadastrados
    return Promise.all(
      labels.map(async (label) => {
        const descriptors = [];
        for (let i = 1; i <= 2; i++) { // Carrega múltiplas imagens de cada morador
          const img = await faceapi.fetchImage(`/images/${label}/${i}.jpg`);
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          descriptors.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptors);
      })
    );
  };

  // Função de validação do CPF (formato xxx.xxx.xxx-xx)
  const validarCPF = (cpf) => {
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
  };

  // Função chamada ao enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificação de campos obrigatórios
    if (!nome || !cpf || !imagem) {
      setErro('Todos os campos são obrigatórios');
      return;
    }

    // Validação do CPF
    if (!validarCPF(cpf)) {
      setErro('CPF inválido. Formato correto: xxx.xxx.xxx-xx');
      return;
    }

    setErro(''); // Limpa o erro se os campos estiverem válidos

    // Realiza o reconhecimento facial na imagem
    const imageElement = await faceapi.bufferToImage(imagem);
    const detection = await faceapi.detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
                                     .withFaceLandmarks()
                                     .withFaceDescriptor();

    if (!detection) {
      alert('Nenhum rosto foi detectado na imagem.');
      return;
    }

    // Prepara os dados para envio ao backend
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('cpf', cpf);
    formData.append('imagem', imagem);

    try {
      await axios.post('/api/moradores', formData);
      alert('Morador cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar morador:', error);
    }
  };

  return (
    <div>
      <video id="videoElement" autoPlay width="720" height="560" onPlay={detectAndRecognize}></video>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="CPF (xxx.xxx.xxx-xx)"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setImagem(e.target.files[0])}
          required
        />
        {erro && <span style={{ color: 'red' }}>{erro}</span>}
        <Button type="submit" variant="contained" color="primary">Cadastrar Morador</Button>
      </form>
    </div>
  );
};

export default CadastroMoradores;

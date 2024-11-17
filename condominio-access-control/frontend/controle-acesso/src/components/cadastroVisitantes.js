import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';

const CadastroVisitantes = () => {
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [imagem, setImagem] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      startVideo();
    };
    loadModels();
  }, []);

  const startVideo = async () => {
    const video = document.getElementById('videoElement');
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
  };

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

  const loadLabeledImages = async () => {
    const labels = ['Visitante1', 'Visitante2'];
    return Promise.all(
      labels.map(async (label) => {
        const descriptors = [];
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(`/images/${label}/${i}.jpg`);
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          descriptors.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptors);
      })
    );
  };

  // Função de validação do documento (exemplo básico para CPF)
  const validarDocumento = (doc) => {
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(doc); // Formato de CPF (xxx.xxx.xxx-xx)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação dos campos
    if (!nome || !documento || !imagem) {
      setErro('Todos os campos são obrigatórios');
      return;
    }

    // Validação do documento
    if (!validarDocumento(documento)) {
      setErro('Documento inválido. Formato correto: xxx.xxx.xxx-xx');
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

    // Prepara os dados para envio
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('documento', documento);
    formData.append('imagem', imagem);

    try {
      await axios.post('/api/visitantes', formData);
      alert('Visitante cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar visitante:', error);
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
          placeholder="Documento (xxx.xxx.xxx-xx)"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setImagem(e.target.files[0])}
          required
        />
        {erro && <span style={{ color: 'red' }}>{erro}</span>}
        <Button type="submit" variant="contained" color="primary">Cadastrar Visitante</Button>
      </form>
    </div>
  );
};

export default CadastroVisitantes;

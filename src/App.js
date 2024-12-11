import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const App = () => {
    const [file, setFile] = useState(null);
    const [conversionType, setConversionType] = useState('pdf-to-word');

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleConvert = async () => {
        if (!file) return alert('Veuillez sélectionner un fichier.');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `http://localhost:5000/convert/${conversionType}`,
                formData,
                { responseType: 'blob' }
            );

            const blob = new Blob([response.data], { type: response.data.type });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `converted.${conversionType === 'pdf-to-word' ? 'docx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Conversion échouée.');
        }
    };

    return (
        <div>
            <h1>Convertisseur PDF/Word</h1>
            <div {...getRootProps()} style={{ border: '1px solid black', padding: '20px', cursor: 'pointer' }}>
                <input {...getInputProps()} />
                {file ? <p>{file.name}</p> : <p>Glissez ou cliquez pour sélectionner un fichier</p>}
            </div>
            <select value={conversionType} onChange={(e) => setConversionType(e.target.value)}>
                <option value="pdf-to-word">PDF vers Word</option>
                <option value="word-to-pdf">Word vers PDF</option>
            </select>
            <button onClick={handleConvert}>Convertir</button>
        </div>
    );
};

export default App;
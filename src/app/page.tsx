'use client'

import * as React from 'react';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import uploadVideo from '@/controller/apis';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';

export default function Home() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [ext, setExt] = React.useState('jpg');
  const [filename, setFilename] = React.useState('');
  const [numberInput, setNumberInput] = React.useState('');
  const [count, setCount] = React.useState(30);
  const [progress, setProgress] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<any>(false);
  const [error, setError] = React.useState<string | null>(null);
/**
 * Handle file changes
 * @param event 
 */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };
  /**
   * Handle Extension Change
   * @param event 
   */
  const handleChange = (event: SelectChangeEvent) => {
    setExt(event.target.value as string);
  };
  /**
   * Handle Width change
   * @param event 
   */
  const handleNumberInputChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setNumberInput(value);
  };
  /**
   * Handle FPS change
   * @param event 
   */
  const handleCountInputChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setCount(Number(value));
  };
  /**
   * Handle upload process
   * @returns 
   */
  const handleButtonClick = async () => {
    setLoading(true);
    setProgress(0);
    const body: any = {
      width: numberInput,
      extension: ext,
      file: selectedFile,
      count: count
    }
    if (!body?.file) {
      setError('Choissez le ficher.');
      setProgress(null);
       setLoading(false);
      return;
    }
    else if (!body?.width) {
      setError('Saisissez Largeur.');
      setProgress(null);
       setLoading(false);
      return;
    }
    else if (!body?.count) {
      setError('Saisissez FPS.');
      setProgress(null);
       setLoading(false);
      return;
    }
    else {
      setError(null)
    }
    const response = await uploadVideo(body);
    const options = JSON.parse(response || {});
    setFilename(options?.filename);
    // console.log("RESPOSNE", JSON.parse(response));
    const paramsUrl = `?filename=${ options?.filename}&fps=${body?.count}&ext=${body?.extension}&width=${body?.width}&save_path=${options?.save_path}`
      const eventSource = new EventSource('http://167.86.121.201:5000'+'/main/progressVideo'+paramsUrl);

      eventSource.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        setProgress(data.progress);
        // setLiveData(data.message);
      });
  
      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        setLoading(false);
        eventSource.close();
      };
    return () => {
      setLoading(false);
        eventSource.close();
      };
  };
  /**
   * Handle download process
   */
  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://167.86.121.201:5000'+`/main/downloadFile?filename=${filename}.zip`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setLoading(false);
    } catch (error) {
      console.log('Error downloading file:', error);
      setLoading(false);
    }
  };
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
          <h1 className="text-2xl mb-4 mb-20">Extraction de frames</h1>
            <p style={{ textAlign: 'left' }}>Fichier vidéo</p>
          <Input
          type="file"
          inputProps={{ accept: 'video/*' }}
          onChange={handleFileChange}
          style={{ background: 'white', padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}
            />
            <p style={{ textAlign: 'left' }}>Extension</p>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={ext}
            label="Extension"
            onChange={handleChange}
            required
            style={{ background: 'white', marginBottom: '10px', width: '100%' }}
          >
              <MenuItem value={'jpg'}>JPG</MenuItem>
              <MenuItem value={'webp'}>WEBP</MenuItem>
            <MenuItem value={'png'}>PNG</MenuItem>
            </Select>
            <p style={{ textAlign: 'left' }}>FPS</p>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={count.toString()}
            label="Extension"
            onChange={handleCountInputChange}
            required
            style={{ background: 'white', marginBottom: '10px', width: '100%' }}
          >
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={60}>60</MenuItem>
            </Select>
            <p style={{ textAlign: 'left' }}>Largeur</p>
            <TextField
              // label="Height"
              type="text"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleNumberInputChange(event)}
              required
              style={{ background: 'white', width: '100%', marginBottom: '10px' }}
            />
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && <Button variant="outlined" color="primary" onClick={handleButtonClick} className='mt-5'>
              Télécharger
            </Button>}
            </div>
          <div style={{ width: '50%', marginTop: '50px' , display: "flex", flexDirection: "column", alignContent:"space-around", justifyContent: "space-between"}}>
            <h3>{progress? progress != 100 ? "Chargement" : "Prêt":""}</h3>
            <LinearProgress variant="determinate" value={progress} />
            {loading && <div className= "mt-10" style={{ textAlign: 'center' }}><CircularProgress /></div>}
            { progress ==100 && !loading &&
              <Button
                variant="outlined"
                color="primary"
                className='mt-10'
                startIcon={<CloudDownloadIcon />}
                onClick={handleDownload}
              >
                Télécharger Zip
              </Button>
            }
              </div>

        </div>
      </main>
    );
}

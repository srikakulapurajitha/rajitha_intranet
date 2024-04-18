import React, { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '@mui/material/Button';
import { Stack, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
// import Input from '@mui/material/Input';
const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    overflowY: 'auto',
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 200,
    height: 80,
    padding: 4,
    boxSizing: 'border-box',
    position: 'relative'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
};

const img = {
    display: 'block',
    width: 190,
    height: 75,
    objectFit:'contain'

};

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    height: '200px'
};

const focusedStyle = {
    borderColor: '#2196f3',
};

const acceptStyle = {
    borderColor: '#00e676',
};

const rejectStyle = {
    borderColor: '#ff1744',
};

function ChartUpload(props) {
    const [imgFile, setImgFile] = useState([]);
    const {compData,clear} = props
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg', '.jpg'],
        },
        maxFiles:1,
        onDrop: (acceptedImgFile) => {
            //console.log(acceptedImgFile)
            setImgFile(acceptedImgFile.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
    }), [isFocused, isDragAccept, isDragReject]);


    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
    
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
    
          fileReader.onerror = (error) => {
            ////console.log('err',error)
            reject(error);
          };
        });
      };
    

    const handleUpload = async () => {
        //console.log(imgFile)
        //console.log('com',compData)
        
        if (compData.company_name!=='' && compData.company_pagename!=='' && compData.company_pagetype ==='Chart' && compData.company_pagestatus!==''){
            if(imgFile.length===1){
                const url = await convertBase64(imgFile[0])
                toast.promise(axios.post('/api/uploadchart',{compData,img:url}),{
                    pending:{
                        render(){
                            return('Adding Page Details')
                        }
                    },
                    success:{
                        render(res){
                            clear()
                            return(res.data.data)
                        }
                    },
                    error:{
                        render(err){
                            return(err.data.response.data)
                        }
                    }
                })
    
                //console.log(url)
            }
            else{
                toast.warning('select file first!')
            }
        }
        else{
            toast.error('Add data properly!')
        }
           
    };

    const handleClear = ()=>{
        setImgFile([])
    }

    return (
        <div className="container">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop Only one JPEG or PNG imgFile here, or click to select.</p>
                <Typography component={'p'} variant='p'>Pre-view</Typography>
                <div style={thumbsContainer}>

                    {imgFile.map((file, index) => (
                        <div style={thumb} key={index}>
                            <div style={thumbInner}>
                                <img src={file.preview} style={img} alt={`Preview ${index}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Stack mt={3} sx={{ display: 'flex', justifyContent: 'center' }} direction={'row'} spacing={4}>
                <Button component="label" variant="outlined" color='success' onClick={handleUpload}>Submit</Button>
                <Button variant="outlined" color='error' onClick={handleClear} >Clear</Button>
            </Stack>

        </div>
    );
}

export default ChartUpload;
import React, {useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Typography } from '@mui/material';


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

function EditChartUpload(props) {
    const {image,handleImage} = props
    const [imgFile, setImgFile] = useState([image]);
    //console.log(imgFile)   
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
        onDrop: async(acceptedImgFile) => {
            //console.log(acceptedImgFile)
            setImgFile(acceptedImgFile.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
            if(acceptedImgFile.length!==0){
                const url = await convertBase64(acceptedImgFile[0])
            handleImage(url)
            }
            
        }
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
    }), [isFocused, isDragAccept, isDragReject]);


    function convertBase64 (file) {
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

    return (
        <div className="container">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop Only one JPEG or PNG imgFile here, or click to select.</p>
                <Typography component={'p'} variant='p'>Pre-view</Typography>
                <div style={thumbsContainer}>

                    {
                    imgFile.map((file, index) =>{
                        //console.log(file)
                        return (
                        <div style={thumb} key={index}>
                            <div style={thumbInner}>
                                <img src={typeof(file)==='string'?file:file.preview} style={img} alt={`Preview ${index}`} />
                            </div>
                        </div>
                    )})
                    }
                </div>
            </div>

        </div>
    );
}

export default EditChartUpload;
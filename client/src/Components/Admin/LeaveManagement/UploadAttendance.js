import React from 'react'
import { Box, Button, Card, Chip, Container, Stack, Typography } from '@mui/material'
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { CloudUpload, FileUpload } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import AccessNavBar from '../../Comman/NavBar/AccessNavBar';



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
	height:'200px'
  };
  
  const focusedStyle = {
	borderColor: '#2196f3'
  };
  
  const acceptStyle = {
	borderColor: '#00e676'
  };
  
  const rejectStyle = {
	borderColor: '#ff1744'
  };
  

function UploadAttendance() {
	const [files, setFiles] = useState([]);
	const {
		getRootProps,
		getInputProps,
		isFocused,
		isDragAccept,
		isDragReject
	  }= useDropzone({

		accept:{
			'application/zip':['.zip']
		  },
		  maxFiles:1,
	
    onDrop: (acceptedFiles) => {
		//console.log(acceptedFiles)
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);
  
  

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  // handling uploading files
  const handleUploadFile = async()=>{
	//console.log(files)
	if (files.length===0){
		toast.warning('Select file to upload!');
	}
	else{
		const form = new FormData();
      	form.append('file', files[0]);

	  let msg=''
    try{
    const result =  
    await toast.promise(
    
		axios.post('/api/uploadattendance', form, {
        	headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
       
      {

        pending: {
          render(){
            return('Uploading File')
          }
          },
        success:  { render(){
			setFiles([])
          return(`${msg} `)
        }
        },
        error:{
        render(){
          return(`${msg}`)
        }
        }
      })
	  msg=(result.data)
	  //console.log(result)
	  
	}
   catch (err){
	msg=(err.response.data)
	
  }
	}
  }

  return (
	<>
	<AccessNavBar />
	<Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, ml: { xs: 8 } }}>
		<div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
		<Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >Upload Attendance</Typography>
			<Container sx={{  width: '100%' }}>
				<Card sx={{p:2,height:{xs:400,md:350}}}>
					
					<section >
						<div {...getRootProps({style})}>
							<input {...getInputProps()} />
							<h3>Drag 'n' drop file here, or click to select file</h3>
							<CloudUpload sx={{fontSize:50}} />
						</div>
						<Typography m={1} component={'h5'} variant='p' color={'red'}>*upload .zip file consting excel sheets</Typography>
						<Stack direction={'row'} height={{xs:30,md:20}} spacing={2} p={1}>
						{files.length!==0?
						<>
						<Typography component={'h3'} variant='p' m={1}>File:</Typography>
						<Chip color="success" label={files[0].name} variant="outlined" onDelete={()=>setFiles([])} />
						</>
						:null}

						</Stack>
						<Box sx={{display:'flex',justifyContent:'center'}}>
						<Button color='info' component="label" variant="contained" endIcon={<FileUpload />} onClick={handleUploadFile}>Upload File</Button>
						</Box>
				     
   					 </section>
				</Card>
			</Container>
		</div>
		
	</Box>
	
	</>
  )
}

export default UploadAttendance
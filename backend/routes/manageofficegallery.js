import expres from 'express'
import { deletegallery, getgalleryimages, uploadStorage, uploadgallaryimages, viewgallery,updategallery, getofficegalleries, retrieveimages } from '../controllers/manageofficegallery.js'


const route = expres.Router()

route.post('/uploadgallaryimages',uploadStorage.array('file'),uploadgallaryimages)
route.get('/viewgallery', viewgallery)
route.post('/getgalleryimages',getgalleryimages)
route.post('/deletegallery',deletegallery)
route.put('/updategallery',uploadStorage.array('file'),updategallery)
route.get('/getofficegalleries',getofficegalleries)
route.post('/retrieveimages',retrieveimages)



export default route
import db from "../config/connectiondb.js";
import fs from "fs"
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import multer from "multer";

const storege = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder_path = `public/officeGallary/${req.body.eventDate.slice(0, 4)}/${req.body.eventTitle}_date_${req.body.eventDate}/`
        if (!fs.existsSync(path)) {
            fs.mkdirSync(folder_path, { recursive: true });
            cb(null, folder_path)
        }
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    },
})

function fileFilter(req, file, cb) {
    const check_gallary_query = `select * from officegallery where event_title=? and event_date =date(?) and id!=?;`
    const check_gallary_values = [req.body.eventTitle, req.body.eventDate, req.body.id]

    db.query(check_gallary_query, check_gallary_values, async (err, result) => {
        if (err) console.log(err)
        else {
            console.log('res',result)
            if (result.length === 0) {
                cb(null, true)
            }
            else {
                cb(null, false)
            }
        }
    })
}

export const uploadStorage = multer({ storage: storege, fileFilter: fileFilter })

export const uploadgallaryimages = (req, res) => {
    //console.log('body',req.body.eventData)
    console.log('file', req.files)


    const check_gallary_query = `select * from officegallery where event_title=? and event_date =date(?);`
    const check_gallary_values = [req.body.eventTitle, req.body.eventDate]

    db.query(check_gallary_query, check_gallary_values, async (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            if (result.length === 0) {
                const galleryId = uuidv4()
                const images = req.files.map(img => ([img.path.replace('public', ''), galleryId]))
                const folder_path = req.files[0].destination
                //console.log(images)
                const insert_gallary_details_query = `insert into officegallery(id, event_title, event_date,gallery_path) values(?)`
                const insert_gallary_details_values = [[galleryId, req.body.eventTitle, req.body.eventDate, folder_path]]
                const insert_gallary_images_query = `insert into officegalleryimages(image, gallery_id) values` + images.map(_ => '(?)').join(',')


                try {
                    await db.promise().query(insert_gallary_details_query, insert_gallary_details_values)
                    await db.promise().query(insert_gallary_images_query, images)
                    return res.status(200).json('Event Gallary Added Successfully')

                }
                catch (error) {
                    console.log(error)
                    return res.status(500).json('error occured!')

                }


            }
            else {
                res.status(406).json('Event Title and Event Date already exists!')
            }
        }
    })



    //res.send('ok')

}

export const viewgallery = (req, res) => {

    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const view_query = `select * from officegallery order by no desc;`
        db.query(view_query, (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                return res.send(result)
            }
        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }

}

export const getgalleryimages = (req, res) => {
    const { id } = req.body
    //console.log(req.body)
    const get_gallery_images_query = `select * from officegalleryimages where gallery_id=?`
    db.query(get_gallery_images_query, [id], (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
        //return res.sendFile('public/'+result[0].image,{root:"."},{data:result})
            return res.send(result)
        }
    })
}

export const retrieveimages = (req,res) =>{
    const {path} = req.body
    return res.sendFile('public/'+path,{root:"."})


}
export const deletegallery = async (req, res) => {
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        console.log(req.body)
        const { id, path } = req.body
        const delete_gallery_query = `delete from officegallery where id in (?)`
        try {
            path.forEach(f_path => {
                fs.rmSync(f_path, { recursive: true, force: true })
            })
            await db.promise().query(delete_gallery_query, [id])
            return res.status(200).json('Gallery Deleted Successfully')


        }
        catch (error) {
            console.log(error)
            return res.status(500).json('error occured!')

        }
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }
    ///
}


export const updategallery = (req, res) => {
    //console.log('files', req.files)
    //console.log(req.body)

    const prevData = JSON.parse(req.body.prevData)
    const eventData = JSON.parse(req.body.eventData)
    const imageData = JSON.parse(req.body.imageData)
    //console.log(prevData, eventData, imageData)
    const check_gallary_query = `select * from officegallery where event_title= ? and event_date = date(?) and id != ?;`
    const check_gallary_values = [eventData.event_title, eventData.event_date, eventData.id]

    db.query(check_gallary_query, check_gallary_values, async (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            if (result.length === 0) {
                if (prevData.eventData.event_title === eventData.event_title && prevData.eventData.event_date === eventData.event_date) {
                    console.log('not change in folders')

                    const previousImagesChanged = prevData.images.filter(img => !imageData.map(img => img.preview).includes(img.preview)).map(img => img.preview)//.map(img => img.preview.replace(regex,'\\'))//.map(img=>img.preview.slice(img.preview.lastIndexOf('/')+1))
                    console.log('changed', previousImagesChanged)

                    const galleryId = eventData.id
                    //const galleryPath = eventData.gallery_path
                    const images = req.files.map(img => ([img.path.replace('public', ''), galleryId]))
                    console.log('images',images)

                    const delete_images_query = `delete from officegalleryimages where image in (?) and gallery_id=? `
                    const delete_images_values = [previousImagesChanged, galleryId]

                    // if new images uploaded insert them

                    const add_new_images_query = `insert into officegalleryimages(image, gallery_id) values ` + images.map(_ => '(?)').join(',')
                    // const add_new_images_values = 


                    try {

                        //insert
                        if (images.length !== 0) {
                            await db.promise().query(add_new_images_query, images)
                        }

                        //delete
                        if (previousImagesChanged.length !== 0) {

                            await db.promise().query(delete_images_query, delete_images_values)
                            previousImagesChanged.forEach(img_path => {
                                fs.rmSync('public' + img_path, { force: true })
                            })

                        }

                        return res.status(200).json('Gallery Updated Successfully')

                    }
                    catch (error) {
                        console.log(error)
                        return res.status(500).json('error occured!')

                    }

                }
                else {

                    const previousImagesChanged = prevData.images.filter(img => !imageData.map(img => img.preview).includes(img.preview)).map(img => img.preview)//.map(img => img.preview.replace(regex,'\\'))//.map(img=>img.preview.slice(img.preview.lastIndexOf('/')+1))
                    console.log('changed', previousImagesChanged)

                    //const notChangedImages = prevData.images.filter(img => !imageData.map(img => img.preview).includes(img.preview)).map(img => img.preview)

                    try {
                        const notChangedImages = prevData.images.filter(img => imageData.map(img => img.preview).includes(img.preview)).map(img => img.preview.replace(/\\/g, '/'))
                        const folder_path = `public/officeGallary/${eventData.event_date.slice(0, 4)}/${eventData.event_title}_date_${eventData.event_date}/`
                        if (!fs.existsSync(path)) {
                            fs.mkdirSync(folder_path, { recursive: true });
                        }
                        const previousFolderImages = []
                        console.log('not changed', notChangedImages)
                        notChangedImages.forEach(img_path => {
                            console.log('public' + img_path, folder_path + img_path.slice(img_path.lastIndexOf('/') + 1))
                            fs.copyFileSync('public' + img_path, folder_path + img_path.slice(img_path.lastIndexOf('/') + 1))
                            previousFolderImages.push([folder_path.replace('public', '') + img_path.slice(img_path.lastIndexOf('/') + 1), eventData.id])
                        })
                        fs.rmSync(eventData.gallery_path, { recursive: true })
                        const delete_images_query = `delete from officegalleryimages where gallery_id=? `
                        const delete_images_values = [eventData.id]
                        await db.promise().query(delete_images_query, delete_images_values)


                        let newAddedImages = []
                        if (
                            newAddedImages = req.files.map(img => ([img.path.replace('public', ''), eventData.id]))
                        )
                            console.log(newAddedImages)
                        const images = [...previousFolderImages, ...newAddedImages]
                        const update_gallary_details_query = `update officegallery set event_title=?, event_date= date(?) ,gallery_path=? where id=?`
                        const update_gallary_details_values = [eventData.event_title, eventData.event_date, folder_path, eventData.id]
                        const insert_gallary_images_query = `insert into officegalleryimages(image, gallery_id) values` + images.map(_ => '(?)').join(',')
                        await db.promise().query(update_gallary_details_query, update_gallary_details_values)
                        await db.promise().query(insert_gallary_images_query, images)
                        return res.status(200).json('Gallery Updated Successfully')
                    }
                    catch (error) {
                        console.log(error)
                        return res.status(500).json('error occured!')

                    }
                }
            }
            else {
                return res.status(406).json('Gallery already exists for the given event!')
            }
        }
    })

}

export const getofficegalleries = (req, res) => {
    if (req.checkAuth.isAuth) {
        const getgalleries_query = `select id, event_title, event_date, (select image from officegalleryimages where gallery_id=id limit 1)as cover_image from officegallery order by no desc`
        db.query(getgalleries_query,(err,result)=>{
            if (err) return res.status(500).json('error occured!')
            else{
                return res.send(result)
            }
        })
    }
    else {
        res.status(406).json('Unauthorized! not allowed to perform action.')
    }
}
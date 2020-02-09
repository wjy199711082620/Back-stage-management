import request from '@/utils/request'

export function listStorage(query) {
  return request({
    url: '/image/list',
    method: 'get',
    params: query
  })
}

export function createStorage(data) {
  return request({
    url: '/image/addImage',
    method: 'post',
    data
  })
}

export function readStorage(data) {
  return request({
    url: '/image/read',
    method: 'get',
    data
  })
}

export function updateStorage(data) {
  return request({
    url: '/image/modifyImage/',
    method: 'post',
    data
  })
}

export function deleteStorage(data) {
  return request({
    url: '/image/delete',
    method: 'post',
    data
  })
}

//const uploadPath = process.env.BASE_API + '/image/addImage'
const uploadPath = process.env.BASE_API + '/file/imageUpload';
export { uploadPath }


export function uploadImage(data) {//据说是个不存在的接口
  return request({
    url: '/image/uploadImage',
    method: 'post',
    data
  })
}


// export function imageUpload(data) {
//   return request({
//     url: '/file/imageUpload ',
//     method: 'post',
//     data:data
//   })
// }


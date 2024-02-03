import axiosInstance from '@/utils/axios';
interface ApiBody {
    file: any;
    height: number,
    extension: string,
    count: number
    // Add more fields if needed
  }
export const uploadVideo = async (body: ApiBody) => {
    try {
        const formData = new FormData();
        formData.append('file', body?.file);
        const apiUrl = `/main/upload_video?count=${body?.count}&ext=${body?.extension}&height=${body?.height}`;
        console.log(apiUrl);
        const response = await axiosInstance.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            },
            responseType: 'stream',
            onUploadProgress: (progressEvent) => {
                console.log(`Upload Progress: =`);
              },
              onDownloadProgress: (progressEvent) => {
                console.log(`Download Progress:`);
              },
        });
      return response.data;
        // console.log('Upload Response:', response.data);
      } catch (error) {
        console.error('Upload Error:', error);
      }
};
export default uploadVideo;
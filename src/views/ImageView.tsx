export const ImageView = ({image, setImage}) => {
    const baseApi = 'http://localhost:8000/';
    return image && (<div className="inset-[0] absolute bg-black/80 p-10 z-[1000] flex items-center justify-center">
        <button className="absolute right-4 top-4 text-white font-3xl" 
            onClick={() => {setImage(undefined)}}
            >
            X
        </button>
        <img src={baseApi + image.image_url} className="max-w-[100%] max-h-[100%]" />
    </div>)
}
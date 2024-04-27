import { useState } from "react";
import useShowToast from "./useShowToast";

const MAX_IMAGES = 5;

const usePreviewImg = () => {
    const [imgUrl, setImgUrl] = useState([]);
    const showToast = useShowToast();

    const handleImageChange = (e) => {
        const selectedFiles = e.target.files;

        if (!selectedFiles.length) return;

        const validImages = [];
        for (let i = 0; i < selectedFiles.length && i < MAX_IMAGES; i++) {
            const file = selectedFiles[i];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();

                reader.onloadend = () => {
                    validImages.push(reader.result);
                    if (validImages.length === selectedFiles.length) {
                        setImgUrl(validImages);
                    }
                };

                reader.readAsDataURL(file);
            } else {
                showToast("Invalid file type", "Please select an image file", "error");
            }
        }
    };
    // console.log(imgUrl);
    return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;

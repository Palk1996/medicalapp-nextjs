import { toast } from 'react-toastify';
import Swal from 'sweetalert2'

export const onSweetAlert = (title, subTitle, icon) => {
    Swal.fire({
        title: title,
        text: subTitle,
        icon: icon
    });
}

export const onSweetAsking = (question, behavior) => {
    Swal.fire({
        title: question,
        showCancelButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "#c60f31",
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            Swal.fire("Saved!", "", "success");
            behavior();
        }
    });
}

export const onFailureToastify = (title) => {
    toast.error(title, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}
export const onSuccessToastify = (title) => {
    toast.success(title, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}
import { hideToast, showToast } from "@/store/slices/toastSlice";
import { useDispatch } from "react-redux";

export  const useNotification = () => {
  const dispatch = useDispatch();

  const showNotification = (
    message: string,
    type: "info" | "success" | "error" | "warning" = "info",
    durarion: number = 10
  ) => {
    dispatch(showToast({ message, type }));
    
    setTimeout(() => {
      dispatch(hideToast());
    }, durarion * 1000);
  };

  return { showNotification };
};

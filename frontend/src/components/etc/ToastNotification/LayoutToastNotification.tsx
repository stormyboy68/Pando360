'use client';

import { FC } from "react";
import ToastNotification from "@/components/etc/ToastNotification/ToastNotification";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideToast } from "@/store/slices/toastSlice";

interface LayoutToastNotificationProps {}

const LayoutToastNotification: FC<LayoutToastNotificationProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { showToast, toastMessage, toastType } = useAppSelector(
    (state) => state.toast
  );
  return (
    <div>
      {showToast && (
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={() => dispatch(hideToast())}
        />
      )}
    </div>
  );
};
export default LayoutToastNotification;

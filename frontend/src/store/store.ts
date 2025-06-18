import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user/userSlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        toast: toastReducer,
    },
    // // در محیط توسعه، سریالایز کردن تاریخ‌ها و RegExp را غیرفعال می‌کنیم
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: {
    //             // برای اجتناب از خطاهای سریالایز کردن در محیط توسعه
    //             ignoredActions: ['user/loadUser'],
    //             ignoredPaths: ['user.userData'],
    //         },
    //     }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
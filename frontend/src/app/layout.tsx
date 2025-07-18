export const dynamic = "force-dynamic";
import { cookies } from 'next/headers';
import { GetWT } from '@/Rotuer/RouteOutWT';
import PreloadProvider from '@/providers/PreloadProvider';
import StoreProvider from '@/store/StoreProvider';
import LayoutToastNotification from '@/components/etc/ToastNotification/LayoutToastNotification';
import Navbar from "@/components/navbar/navbar";
import "./globals.css";
import LayoutProviderStore from "@/providers/LayoutProviderStore";
import { Footer } from '@/components/footer/Footer ';
import { getUserInfoAction } from '@/components/auth/action';

async function getUserData() {
  const cookieStore = await cookies();
  try {
    const hasAccessToken = await cookieStore.has('access_token');
    if (!hasAccessToken) {
      return null;
    }
    const response = await getUserInfoAction();
    if (response?.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getUserData();

  return (
    <html lang="fa">
      <body className=''>
        <StoreProvider>
          <PreloadProvider initialData={userData}>
            <LayoutProviderStore>
              <Navbar />
              <main>
                {children}
                <LayoutToastNotification />
              </main>
              <Footer />
            </LayoutProviderStore>
          </PreloadProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";
import Container from "@/components/container";
import HomePage from "@/components/home/HomePage";
import {GetWT} from "@/Rotuer/RouteOutWT";
import Image from "next/image";

export interface IPanels {
    id: number;
    name: string;
}

export interface IServers {
    id: number;
    name: string;
    panel_id: number;
    url: string;
    token_expires_at: string;
    is_active: boolean;
}

export default async function Home() {
    const response = await GetWT("/servers");
    const servers: IServers[] = response?.data;
    const selectOptionsServers = servers?.map((item) => ({
        value: item.id.toString(),
        label: item.name,
        url: item.url
    })) || [];

    return (
        <div>
            <Container className="mt-10">
                <HomePage selectOptionsservers={selectOptionsServers} servers={servers}/>
            </Container>
        </div>
    );
}

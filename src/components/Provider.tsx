"use client";
import ProviderAuth from "./ProviderAuth";

type Prop = {
    children: React.ReactNode;
}

const Provider: React.FC<Prop> = (Prop: Prop) => {
    return (
        <ProviderAuth>
            {Prop.children}
        </ProviderAuth>
    );
}

export default Provider;
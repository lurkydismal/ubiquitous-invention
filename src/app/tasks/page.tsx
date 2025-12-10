import { Fragment } from "react";
import OrderTable from "@/components/OrderTable";
import OrderList from "@/components/OrderList";

export default function Home() {
    return (
        <Fragment>
            <OrderTable />
            <OrderList />
        </Fragment>
    );
}

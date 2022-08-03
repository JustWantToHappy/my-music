import React from 'react'
import { useRoutes } from "react-router-dom"
import routes from "../../routes"
const Container = function () {
    const element = useRoutes(routes);
    return (
        <div>
            {element}
        </div>
    )
}
export default Container;
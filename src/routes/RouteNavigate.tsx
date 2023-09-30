import { useLocation } from 'react-router-dom'
import PageNotFound from '../pages/PageNotFound'
const RouteNavigate = (props: {
  routeConfig: Array<{ path: string; element: JSX.Element; auth: boolean }>
}) => {
  const location = useLocation()
  //pathname表示当前页面路径
  const { pathname } = location
  let routes = props.routeConfig
  let currentRoute: JSX.Element
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].path === pathname) {
      currentRoute = routes[i].element
      break
    }
  }
  //判断用户是否登录
  const hasLogin = localStorage.getItem('hasLogin')
  const getRoute = () => {
    for (let i = 0; i < routes.length; i++) {
      if (!hasLogin && pathname === 'mymc') {
        return currentRoute
      } else if (pathname === routes[i].path) {
        return routes[i].element
      }
    }
    return <PageNotFound />
  }
  return getRoute()
}
export default RouteNavigate

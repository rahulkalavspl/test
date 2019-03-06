import React from 'react';
import Redirect from 'umi/redirect';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';

function AuthComponent({ children, location, routerData, status }) {
  const isLogin = status === 'ok';

  const getRouteAuthority = (path, routeData) => {
    let authorities;
    routeData.forEach(route => {
      // match prefix
      if (pathToRegexp(`${route.path}(.*)`).test(path)) {
        if (route.authority) {
          authorities = route.authority;
        }
        // get children authority recursively
        if (route.routes) {
          const auths = getRouteAuthority(path, route.routes);
          if (auths) {
            authorities = auths;
          }
        }
      }
    });
    return authorities;
  };
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routerData)}
      noMatch={isLogin ? <Redirect to="/exception/403" /> : <Redirect to="/user/login" />}
    >
      {children}
    </Authorized>
  );
}
export default connect(({ menu: menuModel, login: loginModel }) => ({
  routerData: menuModel.routerData,
  status: loginModel.status,
}))(AuthComponent);

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";
import { Container, Content,Icon } from "native-base";
import LinearGradient from 'react-native-linear-gradient';
//navigation
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  NavigationActions
} from "react-navigation";
//views
import SplashPageView from './SplashPageView';
import CustomLoginView from './CustomLoginView';
import SettingView from "./SettingView";

import HomePage from "./views/HomePage";
import ArticleView from "./views/ArticleView";
import ContentView from "./views/ContentView";
import MyOrderView from "./views/MyOrderView";
import StatementView from "./views/StatementView";
import MandatoryUpdateView from "./MandatoryUpdateView";
import ConfirmOrderView from "./views/ConfirmOrderView";
import UserHelperView from "./views/UserHelperView";
import PaySettingView from "./views/PaySettingView";
import CreditCardView from "./views/CreditCardView";
import ManageCreditCardView from './views/ManageCreditCardView';
import MoreDetailView from './views/MoreDetailView';
import FeedbackView from './views/FeedbackView';
//api
import source from "./api/CancelToken";
//utils
import GLOBAL_PARAMS,{ ABORT_LIST_WITH_ROUTE } from "./utils/global_params";
import JSONUtils from "./utils/JSONUtils";
//store
import store from "./store";
//components
import TabBar from "./components/Tabbar";
import BackAndroidHandler from "./components/BackAndroidHandler";
//styles
import MainViewStyles from './styles/mainview.style';
//language
import i18n from './language/i18n';

const tabView = TabNavigator(
  {
    ShopTab: {
      screen: BackAndroidHandler(HomePage),
      navigationOptions: {
        // tabBarLabel: '每日推薦',
        // drawerLockMode: Platform.OS=='ios'?'unlocked':'locked-closed', // 修复安卓侧滑问题
        tabBarIcon: ({ focused }) => {
          return focused ? (
            <Image
              style={MainViewStyles.tabBarImage}
              resizeMode="stretch"
              source={require('./asset/Shape.png')}
            />
        ): (<Image
          style={MainViewStyles.tabBarImage}
          resizeMode="stretch"
          source={require('./asset/Shape_inactive.png')}
        />)}
      }
    },
    ArticleTab: {
      screen: ArticleView,
      navigationOptions: {
        // tabBarLabel: "本週菜單",
        drawerLockMode: Platform.OS=='ios'?'unlocked':'locked-closed',
        tabBarIcon: ({ focused }) => {
          return focused ? (
          <Image
            style={MainViewStyles.tabBarImage}
            resizeMode="stretch"
            source={require('./asset/date_active.png')}
          />
        ): (<Image
          style={MainViewStyles.tabBarImage}
          resizeMode="stretch"
          source={require('./asset/date.png')}
        />)}
      }
    }
  },
  {
    // tabBarComponent: TabBar,
    animationEnabled: false,
    swipeEnabled: false,
    tabBarPosition: "bottom",
    lazyLoad: false, //该属性只会加载tab的当前view
    tabBarComponent: TabBar,
    backBehavior:"none",
    removeClippedSubviews: false,
    tabBarOptions: {
      showLabel: true,
      showIcon: true
    }
  }
);

const darwerView = DrawerNavigator(
  {
    GoodsListDrawer: {
      screen: tabView,
    }
  },
  {
    drawerWidth: GLOBAL_PARAMS._winWidth * 0.75,
    drawerPosition: "left",
    contentComponent: props => {
      let {language} = props.screenProps;
      return (
        <Container>
        <View>
          <LinearGradient colors={['#FF7F0B','#FF1A1A']} start={{x:0.0, y:0.0}} end={{x:1.0,y: 0.0}} style={MainViewStyles.drawerTopContainer}>
            <Image source={require('./asset/logoTop.png')} style={MainViewStyles.drawerTopImage}/>
          </LinearGradient>
        </View>
          <Content style={MainViewStyles.drawerContent}>
            <View style={MainViewStyles.drawerInnerContent}>
              <TouchableOpacity
              onPress={() => {
                if(props.screenProps.user === null) {
                  props.navigation.navigate("Login",{page: 'MyOrder'});
                }else {
                  props.navigation.navigate('MyOrder');
                }
              }}
                style={MainViewStyles.drawerItemBtn}
              >
                <Image
                  source={require("./asset/order.png")}
                  style={MainViewStyles.drawerItemImage}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  style={MainViewStyles.drawerItemText}
                >
                  {i18n[language].myorder}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                    if(props.screenProps.user === null) {
                      props.navigation.navigate("Login",{page: 'PayType'});
                    }else {
                      props.navigation.navigate('PayType',{from:'drawer'});
                    }
                  }}
                style={MainViewStyles.drawerItemBtn}
              >
                <Image 
                  source={require('./asset/payment.png')} 
                  style={MainViewStyles.drawerItemImage}
                  resizeMode="contain"
                  />
                <Text
                  allowFontScaling={false}
                  style={MainViewStyles.drawerItemText}
                >
                  {i18n[language].payment}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('Help');
                }}
                style={MainViewStyles.drawerItemBtn}
              >
                <Image
                  source={require("./asset/help.png")}
                  style={MainViewStyles.drawerItemImage}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  style={MainViewStyles.drawerItemText}
                >
                  {i18n[language].contact}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={MainViewStyles.drawerItemBtn}
                onPress={() => props.navigation.navigate("Statement", { name: "about" })}
              >
                <Image
                  source={require("./asset/account.png")}
                  style={MainViewStyles.drawerItemImage}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  style={MainViewStyles.drawerItemText}
                >
                  {i18n[language].about}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => props.navigation.navigate("Setting")}
              style={MainViewStyles.drawerItemBtn}
            >
              <Image source={require('./asset/setting.png')} style={MainViewStyles.drawerItemImage}
              resizeMode="contain"/>
              <Text allowFontScaling={false} style={MainViewStyles.drawerItemText}>{i18n[language].setting}</Text>
            </TouchableOpacity>
            </View>
          </Content>
        </Container>
      );
    }
  },
);

let MainView = StackNavigator(
  {
    Home: {
      screen: darwerView,
      
    },
    // Splash: {
    //   screen: SplashPageView
    // },
    Mandatory: {
      screen: MandatoryUpdateView
    },
    Content: {
      screen: ContentView,
      navigationOptions: {
        tabBarVisible: false
      }
    },
    Login: {
      screen: CustomLoginView,
      navigationOptions: {
        tabBarVisible: false,
        transitionConfig: {
          isModal: true
        }
      }
    },
    Setting: {
      screen: SettingView
    },
    Statement: {
      screen: StatementView
    },
    Order: {
      screen: ConfirmOrderView
    },
    MyOrder: {
      screen: MyOrderView
    },
    Help: {
      screen: UserHelperView
    },
    PayType: {
      screen: PaySettingView
    },
    Credit: {
      screen: CreditCardView
    },
    Manage_Card: {
      screen: ManageCreditCardView
    },
    MoreDetail: {
      screen: MoreDetailView
    },
    Feedback: {
      screen: FeedbackView
    }
  },
  { headerMode: "none",
    cardStyle: {
      backgroundColor: '#fff',
    },
    transitionConfig: (): Object => ({
      containerStyle: {
        backgroundColor: '#fff',
      },
    }),
  }
);

// 自定义路由拦截
const defaultGetStateForAction = MainView.router.getStateForAction;

// 拦截路由主方法
MainView.router.getStateForAction = (action, state) => {
  // console.log('action', action)
  // console.log('state', state)
  if (action.type === NavigationActions.NAVIGATE) {
    source.cancel();
  }
  if (
    typeof state !== "undefined" &&
    state.routes[state.routes.length - 1].routeName === "Search"
  ) {
    const routes = state.routes.slice(0, state.routes.length - 1);
    return defaultGetStateForAction(action, {
      ...state,
      routes,
      index: routes.length - 1
    });
  }
  if(action.type != 'Navigation/SET_PARAMS') {
    if(action.routeName == 'DrawerClose' || action.routeName == 'ShopTab') { //监听首页
      store.dispatch({type:'REFRESH',refresh: new Date()});
    }
  }

  if (state && action.type === NavigationActions.NAVIGATE) {
    if (action.params && action.params.replaceRoute) {
      //replaceRoute值 仅仅作为一个标识，进到这个方法之后就没有作用了
      delete action.params.replaceRoute;
      if (state.routes.length > 1 && state.index > 0) {
          const routes = state.routes.slice(0, state.routes.length - 1);
      // routes.push(action)
          return defaultGetStateForAction(action, {
            ...state,
            routes,
            index: routes.length - 1
          });
      }
    }
  }

  // 避免重复跳转
  if(state && action.type == NavigationActions.NAVIGATE && action.routeName == state.routes[state.routes.length - 1].routeName){
    return null
  }
  return defaultGetStateForAction(action, state);
};

export default MainView;

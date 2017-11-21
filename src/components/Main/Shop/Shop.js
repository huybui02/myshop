import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Header from './Header';
import Home from './Home/Home';
import Contact from './Contact/Contact';
import Cart from './Cart/Cart';
import Search from './Search/Search';
import global from '../../../components/global';

import initData from '../../../api/initData';
import saveCart from '../../../api/saveCart';
import getCart from '../../../api/getCart';

import homeIconS from '../../../media/appIcon/home.png';
import homeIcon from '../../../media/appIcon/home0.png';
import cartIconS from '../../../media/appIcon/cart.png';
import cartIcon from '../../../media/appIcon/cart0.png';
import searchIconS from '../../../media/appIcon/search.png';
import searchIcon from '../../../media/appIcon/search0.png';
import contactIconS from '../../../media/appIcon/contact.png';
import contactIcon from '../../../media/appIcon/contact0.png';

class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            selectedTab: 'home',
            types: [],
            topProducts: [],
            cartArray: [] 
        };
        global.addProductToCart = this.addProductToCart.bind(this);
        global.incrQuantity = this.incrQuantity.bind(this);
        global.decrQuantity = this.decrQuantity.bind(this);
        global.removeProduct = this.removeProduct.bind(this);
        global.gotoSearch = this.gotoSearch.bind(this);
    }

    componentDidMount() {
        initData()
        .then(resJSON => {
            const { type, product } = resJSON;
            this.setState({ types: type, topProducts: product });
        });
        getCart()
        .then(cartArray => this.setState({ cartArray }));
    }

    addProductToCart(product) {
        const isExit = this.state.cartArray.some(e => e.product.id === product.id);
        if(isExit) return;
        else{
        this.setState(
            { cartArray: this.state.cartArray.concat({ product, quantity: 1 }) }, 
            () => saveCart(this.state.cartArray)
        );
    }
    }
    incrQuantity(productId) {
        const newCart = this.state.cartArray.map(e => {
            if (e.product.id !== productId) return e;
            return { product: e.product, quantity: e.quantity + 1 };
        });
        this.setState({ cartArray: newCart }, 
            () => saveCart(this.state.cartArray)
        );
    }

    decrQuantity(productId) {
        const newCart = this.state.cartArray.map(e => {
            if (e.product.id !== productId) return e;
            return { product: e.product, quantity: e.quantity - 1 };
        });
        this.setState({ cartArray: newCart }, 
            () => saveCart(this.state.cartArray)
        );
    }

    removeProduct(productId) {
        const newCart = this.state.cartArray.filter(e => e.product.id !== productId);
        this.setState({ cartArray: newCart }, 
            () => saveCart(this.state.cartArray)
        );
    }

    openMenu() {
        const { open } = this.props;
        open();
    }
    gotoSearch(){
        this.setState({
            selectedTab : 'search'
        });
    }

    render() {
        const { iconStyle } = styles;
        const { types, selectedTab, topProducts, cartArray } = this.state;
        return (
            <View style={{ flex: 1 , backgroundColor:'#DFDFDF'}}>
                <Header onOpen={this.openMenu.bind(this)} />
                <TabNavigator>
                    <TabNavigator.Item
                        selected={selectedTab === 'home'}
                        title="Trang chủ"
                        onPress={() => this.setState({ selectedTab: 'home' })}
                        renderIcon={() => <Image source={homeIcon} style={iconStyle} />}
                        renderSelectedIcon={() => <Image source={homeIconS} style={iconStyle} />}
                        selectedTitleStyle={{ color: '#34B089', fontFamily: 'Avenir' }}
                    >
                        <Home types={types} topProducts={topProducts} />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={selectedTab === 'cart'}
                        title="Giỏ hàng"
                        onPress={() => this.setState({ selectedTab: 'cart' })}
                        renderIcon={() => <Image source={cartIcon} style={iconStyle} />}
                        renderSelectedIcon={() => <Image source={cartIconS} style={iconStyle} />}
                        badgeText={cartArray.length}
                        selectedTitleStyle={{ color: '#34B089', fontFamily: 'Avenir' }}
                    >
                        <Cart cartArray={cartArray} />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={selectedTab === 'search'}
                        title="Tìm kiếm"
                        onPress={() => this.setState({ selectedTab: 'search' })}
                        renderIcon={() => <Image source={searchIcon} style={iconStyle} />}
                        renderSelectedIcon={() => <Image source={searchIconS} style={iconStyle} />}
                        selectedTitleStyle={{ color: '#34B089', fontFamily: 'Avenir' }}
                    >
                        <Search />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={selectedTab === 'contact'}
                        title="Liên hệ"
                        onPress={() => this.setState({ selectedTab: 'contact' })}
                        renderIcon={() => <Image source={contactIcon} style={iconStyle} />}
                        renderSelectedIcon={() => <Image source={contactIconS} style={iconStyle} />}
                        selectedTitleStyle={{ color: '#34B089', fontFamily: 'Avenir' }}
                    >
                        <Contact />
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    iconStyle: {
        width: 20, height: 20
    }
});

export default Shop;
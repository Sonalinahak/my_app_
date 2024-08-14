import React, { createContext, useState, useContext, useReducer } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//context
const FavoritesContext = createContext();
const CartContext = createContext();

const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (product) => {
    setFavorites([...favorites, product]);
  };

  const removeFavorite = (product) => {
    setFavorites(favorites.filter((fav) => fav.id !== product.id));
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};


//reducer 
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.product];
    case 'REMOVE_FROM_CART':
      return state.filter((item) => item.id !== action.product.id);
    default:
      return state;
  }
};

//cart provider
const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const removeFromCart = (product) => {
    dispatch({ type: 'REMOVE_FROM_CART', product });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

const backgroundImage = {
  uri: "https://as2.ftcdn.net/v2/jpg/02/87/69/55/1000_F_287695520_GagNdRjB27CPiq5XDCdJIFMiT0So0gw7.jpg",
};

//screen
const GettingStarted = ({ navigation }) => (
  <ImageBackground source={backgroundImage} style={styles.background}>
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome Foodies!</Text>
      <Button
        title="Get Started"
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  </ImageBackground>
);


//Logout
const Endingpage = ({ navigation }) => (
  <ImageBackground source={backgroundImage} style={styles.background}>
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Logged out</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate('GettingStarted')}
      />
    </View>
  </ImageBackground>
);



//signup
const Signup = ({ navigation }) => {
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [username, setUsername] = useState('');

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.signupText}>Create an account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={signupEmail}
          onChangeText={setSignupEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={signupPassword}
          onChangeText={setSignupPassword}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Sign Up"
            onPress={() =>
              navigation.navigate('Login', {
                signupEmail,
                signupPassword,
                username,
              })
            }
          />
        </View>
      </View>
    </ImageBackground>
  );
};

//login
const Login = ({ navigation, route }) => {
  const { signupEmail, signupPassword, username } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.loginText}>Log in to your account</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            onPress={() => {
              if (email === signupEmail && password === signupPassword) {
                navigation.navigate('Home', { username });
              } else {
                Alert.alert('Error', 'Login and signup details do not match');
              }
            }}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

// welcome
const Welcome = ({ navigation, route }) => {
  const { username } = route.params;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
        <Button
          title="View Products"
          onPress={() => navigation.navigate('Products')}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

// product card
const ProductCard = ({ title, description, price, image, onAddToCart }) => {
  const { addFavorite, removeFavorite, favorites } =
    useContext(FavoritesContext);

  const isFavorite = favorites.some((fav) => fav.title === title);

  const handleFavoritePress = () => {
    const product = { title, description, price, image };

    if (isFavorite) {
      removeFavorite(product);
    } else {
      addFavorite(product);
    }
  };

  return (
    <View style={styles.productContainer}>
      <Image source={{ uri: image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{title}</Text>
      <Text style={styles.productDescription}>{description}</Text>
      <Text style={styles.productPrice}>${price}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleFavoritePress}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? 'red' : 'black'}
          />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <Button title="Add to Cart" onPress={onAddToCart} />
        </View>
      </View>
    </View>
  );
};

// favorites card
const FavoritesCard = ({
  title,
  description,
  price,
  image,
  onRemoveFromFavorites,
}) => (
  <View style={styles.productContainer}>
    <Image source={{ uri: image }} style={styles.productImage} />
    <Text style={styles.productTitle}>{title}</Text>
    <Text style={styles.productDescription}>{description}</Text>
    <Text style={styles.productPrice}>${price}</Text>
    <Button title="Remove from Favorites" onPress={onRemoveFromFavorites} />
  </View>
);

// product
const Product = ({ navigation }) => {
  const { addToCart } = useContext(CartContext);

  const products = [
    {
      id: 1,
      title: 'Red Velvet Cake',
      price: 10,
      description:
        'An unfrosted cake that puts the focus back on the texture & colour of Red Velvet. It has the right sweetness with minimal whipped cream between layers. The unfinished look adds an elegant touch.',
      category: "Cakes",
      image: 'https://w7.pngwing.com/pngs/411/103/png-transparent-red-velvet-cake-birthday-cake-cream-wedding-cake-red-velvet-cake-food-cake-decorating-frozen-dessert-thumbnail.png',
     
    },
    {
      id: 2,
      title: 'Black Forest Cake ',
      price: 22.3,
      description:
        'It is a rich, decadent chocolate cake layered with whipped cream, cherries, and often a touch of cherry liqueur.',
      category: "Cakes",
      image:
        'https://w7.pngwing.com/pngs/519/476/png-transparent-chocolate-cake-birthday-cake-layer-cake-chocolate-brownie-chocolate-truffle-chocolate-cake-food-recipe-cake-decorating-thumbnail.png',
     
    },
    {
      id: 3,
      title: 'Nutella Cheesecake',
      price: 55.99,
      description:
        'Indulge in a rich and creamy cheesecake infused with the irresistible flavor of Nutella.',
      category: "Cheesecake",
      image: 'https://i0.wp.com/www.janespatisserie.com/wp-content/uploads/2015/08/IMG_8473.jpg',
      
    },
    {
      id: 4,
      title: 'Blueberry Cheesecake',
      price: 15.99,
      description: "A creamy, dreamy cheesecake topped with a burst of fresh blueberries.",
      image: 'https://2.bp.blogspot.com/-Q3Y-41b0law/W4_DFtU2PsI/AAAAAAAAANs/MjfWShO2cII_yGP6o1S5rFpYOl-oDBgIACLcBGAs/s1600/The-Easiest-Ever-No-Bake-Blueberry-Cheesecake-Featured-Image-1.jpg',
      
    },
    {
      id: 5,
      title: "Lotus Biscoff Cheesecake",
      price: 50,
      description: "A heavenly blend of creamy cheesecake and crunchy Lotus Biscoff cookie crumbles, creating a truly indulgent dessert.",
      category: 'Cheesecake',
      image: 'https://cdn.shopify.com/s/files/1/0279/6329/3831/products/lotusbiscoffcake_1024x1024.jpg?v=1645454165',
      
    },
    {
      id: 6,
      title: 'Vanilla Cupcake',
      price: 16,
      description: 'Miniature cake in a cup, topped with frosting and sprinkles.',
      category: 'Cakes',
      image: 'https://www.cookingclassy.com/wp-content/uploads/2021/09/vanilla-cupcakes-4.jpg',
     
    },
    {
      id: 7,
      title: 'Belgium Waffle',
      price: 9.99,
      description: "A light, airy, and crispy waffle with deep pockets, perfect for indulging in sweet toppings or savory bites.",
      category: 'Bread',
      image: 'https://www.cookingclassy.com/wp-content/uploads/2019/06/belgian-waffles-3.jpg',
      
    },
    {
      id: 8,
      title: 'Donut',
      price: 7.50,
      description: 'A sweet, fried pastry often ring-shaped, with various fillings and toppings.',
      category: 'Bread',
      image: 'https://img.freepik.com/premium-photo/photo-one-delicious-donut-with-topping-top-view-isolated-white-background_174590-1227.jpg',
     
    },
    {
      id: 9,
      title: 'Croissant',
      price: 20,
      description: 'A refreshing blended iced beverage made with coffee, milk, and ice, often sweetened and flavored with syrups or whipped cream.',
      category: 'Bread',
      image: 'https://img.freepik.com/premium-photo/croissant-with-white-background-word-croissant-it_721662-563.jpg',
      
    },
    {
      id: 10,
      title: 'Frappe',
      price: 22,
      description: 'A refreshing blended iced beverage made with coffee, milk, and ice, often sweetened and flavored with syrups or whipped cream.',
      category: 'Drinks',
      image: 'https://images.squarespace-cdn.com/content/v1/5df16aed0c79a2288a94da09/1642800808051-WR2WY2SSX50H7N7M2R94/frappe.jpg',
      
    },
    {
      id: 11,
      title: 'Cookies',
      price: 9,
      description: 'Brown sugar cookie mixed with dark chocolate chunks',
      category: 'Cookies',
      image: 'https://i1.wp.com/lmld.org/wp-content/uploads/2014/11/Pumpkin-Chocolate-Chip-Cookies-1.jpg',
      
    },
    {
      id: 12,
      title: 'Pancake with maple syrup',
      price: 12,
      description: " They are served with syrup, butter, and fruit, but can also be enjoyed with savory toppings.",
      category: 'electronics',
      image: 'https://image.brigitte.de/10941328/t/bI/v3/w1440/r1/-/pancakes.jpg',
     
    },
    
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcomeText}>Products</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              title={item.title}
              description={item.description}
              price={item.price}
              image={item.image}
              onAddToCart={() => handleAddToCart(item)}
            />
          )}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

// favorites
const Favorites = ({ navigation }) => {
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  const handleRemoveFromFavorites = (product) => {
    removeFavorite(product);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcomeText}>Favorites</Text>
        {favorites.length === 0 ? (
          <Text>No favorites yet</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FavoritesCard
                title={item.title}
                description={item.description}
                price={item.price}
                image={item.image}
                onRemoveFromFavorites={() => handleRemoveFromFavorites(item)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

// cart
const Cart = ({ navigation }) => {
  const { cart, removeFromCart } = useContext(CartContext);

  const handleRemoveFromCart = (product) => {
    removeFromCart(product);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcomeText}>Cart</Text>
        {cart.length === 0 ? (
          <Text>No items in the cart</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FavoritesCard
                title={item.title}
                description={item.description}
                price={item.price}
                image={item.image}
                onRemoveFromFavorites={() => handleRemoveFromCart(item)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeTabs = ({ route }) => {
  const { username } = route.params;

  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={Welcome}
        initialParams={{ username }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={Product}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const DrawerNavigation = ({ route }) => {
  const { username } = route.params;

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={Welcome}
        initialParams={{ username }}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => (
            <Ionicons name="home" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name="Products"
        component={Product}
        options={{
          drawerLabel: 'Products',
          drawerIcon: ({ color }) => (
            <Ionicons name="list" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name="Favorites"
        component={Favorites}
        options={{
          drawerLabel: 'Favorites',
          drawerIcon: ({ color }) => (
            <Ionicons name="heart" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={Cart}
        options={{
          drawerLabel: 'Cart',
          drawerIcon: ({ color }) => (
            <Ionicons name="cart" color={color} size={24} />
          ),
        }}
      />

      <Drawer.Screen
        name="Logout" 
        component={Endingpage}
        options={{
          drawerLabel: 'Logout',
          drawerIcon: ({ color }) => (
            <Ionicons name="log-out" color={color} size={24} />
          ),
        }}
      />  

    </Drawer.Navigator>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <FavoritesProvider>
        <CartProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="GettingStarted"
                component={GettingStarted}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Home"
                component={DrawerNavigation}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </FavoritesProvider>
    </PaperProvider>
  );
}

// styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  signupText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  productContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

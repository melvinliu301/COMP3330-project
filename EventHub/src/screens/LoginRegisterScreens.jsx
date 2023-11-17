import { useState } from "react";
import {
    SafeAreaView,
    Text,
    TextInput,
    TouchableHighlight,
    Button,
    StyleSheet,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { auth } from "../firebase/auth";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import Dialog, { DialogContent, DialogTitle } from "react-native-popup-dialog";
import Spinner from "react-native-loading-spinner-overlay";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { setData } from "../firebase/database";
import { ALLOWED_EMAILS } from "../common/constants";

const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [sendEmail, setSendEmail] = useState(false);
    const [signUpFailed, setSignUpFailed] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    const handleSignUp = async () => {
        if (password !== passwordConfirm) {
            setSignUpFailed(true);
            setErrorMessage("Password and confirm password are not the same.");
            return;
        }

        setShowSpinner(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            if (sendEmail) {
                await sendEmailVerification(userCredential.user);
            }

            await setData("Users", userCredential.user.uid, {
                username: username,
                events: [],
            });

            setSignUpSuccess(true);
            console.log(userCredential.user);
        } catch (error) {
            setSignUpFailed(true);
            setErrorMessage(error.message);
            console.log(error.code, error.message);
        } finally {
            setShowSpinner(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Enter your username:</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => setUsername(text)}
                value={username}
            />
            <Text style={styles.text}>Enter your email:</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
            <Text style={styles.text}>Enter your password:</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
            />
            <Text style={styles.text}>Re-enter your password:</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => setPasswordConfirm(text)}
                value={passwordConfirm}
                secureTextEntry={true}
            />
            {ALLOWED_EMAILS.includes(email) ? (
                <BouncyCheckbox
                    textStyle={{ textDecorationLine: "none" }}
                    style={{ marginBottom: 15 }}
                    onPress={setSendEmail}
                    text="Verify email after sign up"
                />
            ) : (
                <Text style={styles.text}>
                    We did not recognize your email. You can still sign up, but
                    you will not be able to verify your email.
                </Text>
            )}

            <TouchableHighlight style={styles.touchableHighlight}>
                <Button title="Sign up" onPress={handleSignUp} />
            </TouchableHighlight>

            <Dialog
                visible={signUpFailed}
                onTouchOutside={() => {
                    setSignUpFailed(false);
                }}
                dialogTitle={
                    <DialogTitle
                        title="Sign Up Failed!"
                        style={styles.dialogTitle}
                        hasTitleBar={false}
                        align="left"
                    />
                }
            >
                <DialogContent>
                    <Text>{errorMessage}</Text>
                </DialogContent>
            </Dialog>

            <Dialog
                visible={signUpSuccess}
                onTouchOutside={() => {
                    setSignUpSuccess(false);
                }}
                dialogTitle={
                    <DialogTitle
                        title="Sign Up Success!"
                        style={styles.dialogTitle}
                        hasTitleBar={false}
                        align="left"
                    />
                }
                onDismiss={() => {
                    navigation.goBack();
                }}
            >
                <DialogContent>
                    <Text>Now you can login with the email and password.</Text>
                </DialogContent>
            </Dialog>

            <Spinner
                visible={showSpinner}
                textContent={"Loading..."}
                textStyle={styles.spinner}
            />
        </SafeAreaView>
    );
};

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    const handleLogin = () => {
        setShowSpinner(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential.user);
            })
            .catch((error) => {
                setLoginFailed(true);
                setErrorMessage(error.message);
                console.log(error.code, error.message);
            })
            .finally(() => {
                setShowSpinner(false);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Enter your email:</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
            <Text style={styles.text}>Enter your password:</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
            />

            <TouchableHighlight style={styles.touchableHighlight}>
                <Button title="Login" onPress={handleLogin} />
            </TouchableHighlight>
            <TouchableHighlight style={styles.touchableHighlight}>
                <Button
                    title="Sign up"
                    onPress={() => {
                        navigation.navigate("Sign Up");
                    }}
                />
            </TouchableHighlight>

            <Dialog
                visible={loginFailed}
                onTouchOutside={() => {
                    setLoginFailed(false);
                }}
                dialogTitle={
                    <DialogTitle
                        title="Login Failed!"
                        style={styles.dialogTitle}
                        hasTitleBar={false}
                        align="left"
                    />
                }
            >
                <DialogContent>
                    <Text>{errorMessage}</Text>
                </DialogContent>
            </Dialog>

            <Spinner
                visible={showSpinner}
                textContent={"Loading..."}
                textStyle={styles.spinner}
            />
        </SafeAreaView>
    );
};

const Stack = createNativeStackNavigator();

const createHeaderTitle = (title) => {
    return (
        <Text
            style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
            }}
        >
            {title}
        </Text>
    );
};

const LoginRegisterScreens = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "orange",
                    borderStyle: "solid",
                    shadowColor: "transparent",
                    height: 43.5,
                },
                headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "white",
                },
                headerTintColor: "white",
            }}
            initialRouteName="Login"
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    headerTitle: () => createHeaderTitle("Login to EventHub"),
                }}
            />
            <Stack.Screen
                name="Sign Up"
                component={SignUpScreen}
                options={{
                    headerTitle: () => createHeaderTitle("Sign Up"),
                }}
            />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 10,
    },
    textInput: {
        height: 40,
        alignSelf: "stretch",
        marginBottom: 15,
        borderColor: "gray",
        borderBottomWidth: 1,
    },
    touchableHighlight: {
        marginBottom: 15,
    },
    dialogTitle: {
        backgroundColor: "#F7F7F8",
    },
    spinner: {
        color: "#FFF",
    },
});

export default LoginRegisterScreens;

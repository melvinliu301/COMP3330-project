import { useState } from "react";
import {
    SafeAreaView,
    Text,
    TextInput,
    TouchableHighlight,
    Button,
    StyleSheet,
} from "react-native";
import { auth } from "../firebase/auth";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import Dialog, {
    DialogContent,
    DialogTitle,
} from "react-native-popup-dialog";
import Spinner from 'react-native-loading-spinner-overlay';

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);
    const [signUpFailed, setSignUpFailed] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
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

    const handleSignUp = () => {
        setShowSpinner(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setSignUpSuccess(true);
                console.log(userCredential.user);
            })
            .catch((error) => {
                setSignUpFailed(true);
                setErrorMessage(error.message);
                console.log(error.code, error.message);
            })
            .finally(() => {
                setShowSpinner(false);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text>Enter your email:</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
            <Text>Enter your password:</Text>
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
                <Button title="Sign up" onPress={handleSignUp} />
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
            >
                <DialogContent>
                    <Text>Now you can login with the email and password.</Text>
                </DialogContent>
            </Dialog>

            <Spinner
                visible={showSpinner}
                textContent={'Loading...'}
                textStyle={styles.spinner}
            />
        </SafeAreaView>
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
    textInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        alignSelf: "stretch",
        marginBottom: 15,
    },
    touchableHighlight: {
        marginBottom: 15,
    },
    dialogTitle: {
        backgroundColor: "#F7F7F8",
    },
    spinner: {
        color: '#FFF',
    },
});

export default LoginScreen;

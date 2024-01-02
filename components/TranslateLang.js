import { NativeModules } from "react-native"
const { TranslateLangMethods } = NativeModules

export async function TranslateLang(inputText) {
    return TranslateLangMethods.englishToChinese(inputText);
}
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
interface FlowerLogoProps {

}

const FlowerLogo: React.FC<FlowerLogoProps> = ({ }) => {

    const animation = useRef<LottieView>(null);
    // useEffect(()=>{
    //     animation.current?.play()
    //     animation.current?.pause()
    // },[])

    return (
        <TouchableOpacity style={styles.container} onPress={()=>{animation.current?.reset(); animation.current?.play()}}>
            <LottieView
                autoPlay
                loop={false}
                ref={animation}
                style={{
                    width: 120,
                    height: 150,
                    // backgroundColor: '#eee',
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require('@/assets/lotties/reith.json')}
            />
        </TouchableOpacity>
    )
}

export default FlowerLogo;



const styles = StyleSheet.create({
    container: {

    },

})
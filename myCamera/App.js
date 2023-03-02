import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import FontAwesome from '@expo/vector-icons/FontAwesome'



export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = Camera.useCameraPermissions();
  const [capturedPicture, setCapturedPicture] = useState(null);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    (async => {
      const { status } = Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

    
  if (!hasPermission) {
    return <View />
  }
  if (!hasPermission.granted) {
    return <Text style={styles.textPermission}>Acesso negado</Text>
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPicture(data.uri);
      setOpen(true);
    }

  }

  return (
    <SafeAreaView style={styles.container}>

      <Camera style={styles.camera} type={type} ref={camRef}>

        <View style={styles.contentButtons}>

          <TouchableOpacity style={styles.buttonFlip} onPress={() => {
            setType(
              type === CameraType.back ? CameraType.front : CameraType.back
            );
          }}>
            <FontAwesome name='retweet' color={'black'} size={23}></FontAwesome>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonCamera}
            onPress={takePicture}
          >
            <FontAwesome name='camera' color={'white'} size={28}></FontAwesome>
          </TouchableOpacity>

        </View>

      </Camera>

      {capturedPicture && (
        <Modal
          animationType='slide'
          transparent={true}
          visible={open}
        >

          <View
            style={styles.contentModal}
          >
            <TouchableOpacity
              style={styles.closeButton} onPress={() => { setOpen(false) }}>

              <FontAwesome name='close' color={'red'} size={23}></FontAwesome>
            </TouchableOpacity>

            <Image
              style={styles.imgPhoto} source={{ uri: capturedPicture }}
            />
          </View>
        </Modal>
      )}

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  textPermission: {
    //  marginTop:'50%',
    //  marginHorizontal: '20%',
    paddingLeft: 120,
    fontSize: 20,
    fontWeight: 'bold'
  },
  contentButtons: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  buttonFlip: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,

  },
  buttonCamera: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,

  },
  contentModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    margin: 20
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 2,
    margin: 10
  },
  imgPhoto: {
    width: '100%',
    height: 400
  }

});

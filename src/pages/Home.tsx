import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import './Home.css';
import { CreateTodo, EditTodo } from '../components'

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle><b>TASK MANAGER</b></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <CreateTodo />
        <EditTodo />
      </IonContent>
    </IonPage>
  );
};

export default Home;

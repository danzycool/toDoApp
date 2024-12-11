import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  IonCol,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonItem,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonToolbar,
  useIonAlert,
  useIonLoading,
  useIonRouter
} from "@ionic/react";
import { paperPlane } from "ionicons/icons";
import Parse from "parse";

import { set } from "../../features/taskRefresherSlice";

const CreateTodo = () => {
  // Create Ionic Alert
  const [presentAlert] = useIonAlert()

  // Create Ionic Loading
  const [loading, dimissLoading] = useIonLoading()

  // Initialize Ionic Router
  const router = useIonRouter()

  // Initialize Redux
  const dispatch = useDispatch()

  // STATE VAR AND STATE ACTION, AND ASSIGN PROPERTIES
  const [newTodoObject, setNewTodoObject] = useState({
    title: "",
    task: "",
    description: "",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // CREATE NEW TODO TASK
  const createNewTodoObject = async () => {
    if(newTodoObject.title == "" || newTodoObject.task == "" || newTodoObject.description == "") {
      presentAlert({
        header: "Form Error",
        message: "Please Fill in all Fields",
        buttons: ['ok']
      })
    } else {
      const newTodo = new Parse.Object("Todo", newTodoObject);
      newTodo.set(newTodoObject);
  
      // Set Loading 
      loading({
        message: "Creating New Task..."
      })
  
      try {
        const newTodoObject = await newTodo.save();
  
        // Dismiss Loading
        dimissLoading()
  
        // Reset Refresh Tasks
        dispatch(set(true)) 
  
        // Alert User
        presentAlert({
          header: "Successful!!!",
          message: "New Task has been Created!!!",
          buttons: ['Ok']
        })
  
        // Refresh Page
        router.push("/home", "forward")
  
        
      } catch (err: any) {
         // Dismiss Loading
         dimissLoading()
  
         presentAlert({
          header: "Successful!!!",
          message: "New Task has been Created!!!",
          buttons: ["Error was found in createNewTodoObject " + err.message]
        })
      }
    } 
  };

  // HANDLE TODO CHANGE
  const handleTodoChange = (event: any) => {
    setNewTodoObject((previous: any) => ({
      ...previous,
      [event.target.name]: event.target.value.trim().replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, ''),
    }));
  };

  return (
    <>
      <IonGrid fixed={true}>
        <IonCard size-md="6" offset-md="3">
          <IonCardHeader>
            <IonToolbar>
              <IonCardTitle color="dark">
                CREATE TODO TASK
                <IonIcon icon={paperPlane} color="dark" />
              </IonCardTitle>
            </IonToolbar>
          </IonCardHeader>

          <IonCardContent>
            <IonRow>
              <IonCol size="6">
                <IonItem>
                  <IonLabel position="stacked">
                    <b>Title:</b>
                  </IonLabel>
                  <IonInput name="title" placeholder="Enter Title" onIonChange={handleTodoChange} />
                </IonItem>
              </IonCol>

              <IonCol size="6">
                <IonItem>
                  <IonLabel position="stacked">
                    <b>Task:</b>
                  </IonLabel>
                  <IonInput name="task" placeholder="Enter Task" onIonChange={handleTodoChange} />
                </IonItem>
              </IonCol>

              <IonCol size="12">
                <IonItem>
                  <IonLabel position="stacked">
                    <b>Description:</b>
                  </IonLabel>
                  <IonTextarea
                    name="description"
                    placeholder="Enter Description"
                    rows={5}
                    onIonBlur={handleTodoChange}
                    style={{ resize: "none" }}
                  ></IonTextarea>
                </IonItem>
              </IonCol>

              <IonCol size="12">
                
                <IonButton
                  onClick={createNewTodoObject}
                  expand="block"
                  color="success"
                >
                  <b>Create</b>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
      </IonGrid>
    </>
  );
};

export default CreateTodo;

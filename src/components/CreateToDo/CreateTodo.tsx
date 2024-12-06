import { useState, useEffect } from 'react'
import { 
  IonCol, 
  IonLabel, 
  IonInput, 
  IonTextarea, 
  IonButton, 
  IonText, 
  IonIcon, 
  IonGrid, 
  IonRow, 
  IonItem, 
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonToolbar
} from '@ionic/react'
import { paperPlane, paperPlaneOutline } from 'ionicons/icons'
import Parse from 'parse'

import './CreateTodo.css'


const CreateTodo = () => {

  // STATE VAR AND STATE ACTION, AND ASSIGN PROPERTIES
  const [newTodoObject, setNewTodoObject] = useState({
    title: "",
    description: "",
    task: "",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // CREATE NEW TODO TASK
  const createNewTodoObject = async () => {
    const newTodo = new Parse.Object("Todo", newTodoObject)
    newTodo.set(newTodoObject)

    try {
      const newTodoObject = await newTodo.save()

      const newTodoObjectJSON = JSON.stringify(newTodoObject)

      alert("The New To Do Object has been Created >>>>| " + newTodoObjectJSON)
    }catch(error: any) {
      alert("Error was found in createNewTodoObject " + error.message)
    }
  }

  // HANDLE TODO CHANGE
  const handleTodoChange = (event: any) => {
    setNewTodoObject((previous: any) => (
      {...previous, [event.target.name]: event.target.value}
    ))
  }

  return (
    <>
      <IonGrid fixed={true}>

        <IonCard size-md="6" offset-md="3">

          <IonCardHeader>
            <IonToolbar>
              <IonCardTitle color="dark">
                  CREATE TODO TASK 
              </IonCardTitle>
            </IonToolbar>
          </IonCardHeader>

          <IonCardContent>
            <IonRow>
              <IonCol size="6">
                <IonItem>
                  <IonLabel position='stacked'><b>Title:</b></IonLabel>
                  <IonInput name="title" onIonChange={handleTodoChange} />
                </IonItem>
              </IonCol>

              <IonCol size="6">
                <IonItem>
                  <IonLabel position='stacked'><b>Task:</b></IonLabel>
                  <IonInput name="task" onIonChange={handleTodoChange} />
                </IonItem>
              </IonCol>

              <IonCol size="12">
                <IonItem>
                  <IonLabel position="stacked"><b>Description:</b></IonLabel>
                  <IonTextarea name="description" rows={5} onIonChange={handleTodoChange} style={{resize: "none"}} />
                </IonItem>
              </IonCol>

              <IonCol size="12">
                <IonButton onClick={createNewTodoObject} expand='block' color="success">
                  <b>Send</b>
                  <IonIcon icon={paperPlane} color='dark'/>
                </IonButton>
              </IonCol>          
            </IonRow>
          </IonCardContent>

        </IonCard>

      </IonGrid>
    </>
  )
}

export default CreateTodo
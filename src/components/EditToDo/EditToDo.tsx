import { FC, ReactElement, useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  IonCol,
  IonCheckbox,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonRippleEffect,
  IonCardSubtitle,
  useIonAlert,
  useIonLoading,
  IonModal,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
} from "@ionic/react";
import { close, settingsSharp } from "ionicons/icons";
import Parse from "parse";

import { set } from "../../features/taskRefresherSlice";

const EditTodo: FC<{}> = (): ReactElement => {
  // Create Ionic Alert
  const [presentAlert] = useIonAlert();

  // Create Ionic Loading
  const [loading, dimissLoading] = useIonLoading();

  // Create Ionic Modal
  const [isOpen, setIsOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    objectId: "",
    title: "",
    description: "",
    task: "",
    isCompleted: Boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Initialize Redux
  const dispatch = useDispatch();
  const refreshTasks = useSelector((state: any) => state.taskRefresher.value);

  // STATE VAR AND SET STATE ACTION
  var [todos, setTodos] = useState([
    {
      objectId: "",
      title: "",
      description: "",
      task: "",
      isCompleted: Boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // Extending the Parse Object
  const Todo: Parse.Object[] = Parse.Object.extend("Todo");

  const parseQuery: Parse.Query = new Parse.Query(Todo);

  // Async function to handle reading tasks with useCallback hook to handle each task
  // instaed of going in an infinite loop
  const readTasks = useCallback(async (): Promise<Boolean> => {
    try {
      const results: Parse.Object[] = await parseQuery.find();

      const mappedData = [];

      for (const object of results) {
        const objectId: string = object.id;
        const title: string = object.get("title");
        const task: string = object.get("task");
        const description: string = object.get("description");
        const isCompleted: boolean = object.get("isCompleted");
        const createdAt: Date = object.get("createdAt");
        const updatedAt: Date = object.get("updatedAt");

        let resultsFix = {
          objectId: objectId,
          title: title,
          task: task,
          description: description,
          isCompleted: isCompleted,
          createdAt: createdAt,
          updatedAt: updatedAt,
        };

        mappedData.push(resultsFix);
      }
      setTodos(mappedData);
      dispatch(set(false));
      return true;
    } catch (error: any) {
      console.warn("Error has been found in readtasks: " + error);
      return false;
    }
  }, []);

  useEffect(() => {
    if (refreshTasks === true) {
      readTasks();
    }
    set(false);
  }, [readTasks, refreshTasks]);

  return (
    <>
      {todos.map((todo: any, index: any) => {
        const objId = todo?.objectId;
        const objTitle = todo?.title;

        const openModal = () => {
          setCurrentTask(todo);
          setIsOpen(true);
        };

        // DELETE TASK
        const deleteTodo = () => {
          presentAlert({
            header: "CONFIRM DELETE",
            message:
              "Are You Sure You Want To Delete Task: " + todo?.title + "?",
            buttons: [
              {
                text: "No",
                role: "cancel",
                handler: () => {
                  return;
                },
              },
              {
                text: "Yes",
                role: "confirm",
                handler: async () => {
                  // Implementing the Loading Function
                  loading({
                    message: "Deleting Task...",
                  });
                  // Carying out the Delete function
                  try {
                    const singleObject: Parse.Object = await parseQuery.get(
                      objId
                    );
                    const response: any = await singleObject.destroy();
                    // Dismiss the Loading Function
                    dimissLoading();
                    // Use timeout to send feedback to user with thesame alert function
                    setTimeout(() => {
                      if (response) {
                        // Refresh Task List
                        readTasks();
                        // Alert User
                        presentAlert({
                          header: "Delete Successful",
                          message: objTitle + " Task has been Deleted!",
                          buttons: ["Ok"],
                        });
                      } else {
                        presentAlert({
                          header: "Failed to Delete",
                          message: "Error!!! Unable to Delete!!",
                          buttons: ["Ok"],
                        });
                      }
                    }, 500);
                  } catch (err: any) {
                    // Dismiss the Loading Function
                    dimissLoading();
                    console.log("Error has been found in Delete Todo: " + err);
                  }
                },
              },
            ],
          });
        };

        // HANDLE TODO CHANGE
        const handleTodoChange = (event: any) => {
          console.log(event.target.value);

          setCurrentTask((previous: any) => ({
            ...previous,
            [event.target.name]: event.target.value.trim().replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, ''),
          }));
        };

        // UPDATE TASK
        const updateTodo = async () => {
          if(currentTask.title == "" || currentTask.task == "" || currentTask.description == "") {
            presentAlert({
              header: "Form Error",
              message: "Please Fill in all Fields",
              buttons: ['ok']
            })
          } else {
            // Set Loading
            loading({
              message: "Updating Task...",
            });
            // Attempt to Update
            try {
              const object = await parseQuery.get(objId);
              object.set("title", currentTask.title);
              object.set("task", currentTask.task);
              object.set("description", currentTask.description);
              object.set("objectId", objId);
              object.save();
              // Dismiss Loading
              dimissLoading();
              // Alert user
              presentAlert({
                header: "Updated Successfully!!!",
                message: "Task has been successfully Updated",
                buttons: ["Ok"],
              });
              // Refresh Tasks
              readTasks();
            } catch (err: any) {
              // Dismiss Loading
              dimissLoading();
              // Alert user
              presentAlert({
                header: "Failed!!!",
                message: "Failed to update Task, please try again later",
                buttons: ["Ok"],
              });
              console.log("Error has been found in updateTask " + err);
            }
            // Close Modal
            setIsOpen(false);
          }
        };

        // UPDATE ISCOMPLETED
        const updateIsCompleted = async () => {
          try {
            const object = await parseQuery.get(objId);
            object.set("isCompleted", true);
            object.set("objectId", objId);
            object.save();
            // Refresh Task List
            readTasks();
          } catch (err: any) {
            console.log("Error has been found in updateTask " + err);
          }
        };

        return (
          <div key={index}>
            <IonGrid>
              <IonRippleEffect></IonRippleEffect>
              <IonRow>
                <IonCol size="12">
                  <IonCard
                    color={todo?.isCompleted === true ? "success" : "light"}
                  >
                    <IonCardHeader>
                      <IonRow>
                        <IonCol size="8">
                          <IonCardTitle>
                            {`${index + 1}. ${todo?.title.toUpperCase()}`}
                          </IonCardTitle>
                        </IonCol>
                        <IonCol size="2">
                          <IonButton
                            id="open-modal"
                            color="success"
                            onClick={openModal}
                          >
                            <IonIcon
                              icon={settingsSharp}
                              color="light"
                            ></IonIcon>
                          </IonButton>
                        </IonCol>
                        <IonCol size="2">
                          <IonButton onClick={deleteTodo} color="danger">
                            <IonIcon icon={close} color="light"></IonIcon>
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonCardHeader>
                    <IonCardSubtitle className="ion-text-center ion-margin-vertical">
                      <b>DESCRIPTION</b>
                      <p>{todo?.description}</p>
                    </IonCardSubtitle>
                    <IonCardContent>
                      <IonRow>
                        <IonCol size="6">
                          <b>Task</b>
                          <p>{todo?.task}</p>
                        </IonCol>
                        <IonCol size="3" className="ion-text-center">
                          <b>Completed</b>
                          <p>
                            <IonCheckbox
                              className="ion-margin-horizontal"
                              color="medium"
                              onClick={updateIsCompleted}
                              disabled={todo?.isCompleted === true}
                            />
                            {todo?.isCompleted.toLocaleString()}
                          </p>
                        </IonCol>
                        <IonCol size="3" className="ion-text-center">
                          <b>Created At</b>
                          <p>{todo?.createdAt.toDateString()}</p>
                        </IonCol>
                      </IonRow>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>

              {/*** Modal Content ***/}
              <IonModal isOpen={isOpen}>
                <IonRow>
                  <IonCol size-md="12">
                    <IonCard>
                      <IonCardHeader>
                        <IonToolbar>
                          <IonTitle className="ion-text-center">
                            <b>UPDATE TASK</b>
                          </IonTitle>
                          <IonButtons
                            slot="end"
                            onClick={() => setIsOpen(false)}
                          >
                            <IonButton color="danger">
                              <IonIcon icon={close} />
                            </IonButton>
                          </IonButtons>
                        </IonToolbar>
                      </IonCardHeader>

                      <IonCardContent>
                        <IonRow>
                          <IonCol size="6">
                            <IonItem>
                              <IonLabel position="stacked">
                                <b>Title:</b>
                              </IonLabel>
                              <IonInput
                                name="title"
                                value={currentTask?.title}
                                onIonChange={handleTodoChange}
                              />
                            </IonItem>
                          </IonCol>

                          <IonCol size="6">
                            <IonItem>
                              <IonLabel position="stacked">
                                <b>Task:</b>
                              </IonLabel>
                              <IonInput
                                name="task"
                                value={currentTask?.task}
                                onIonChange={handleTodoChange}
                              />
                            </IonItem>
                          </IonCol>

                          <IonCol size="12">
                            <IonItem>
                              <IonLabel position="stacked">
                                <b>Description:</b>
                              </IonLabel>
                              <IonTextarea
                                name="description"
                                value={currentTask?.description}
                                rows={5}
                                onIonBlur={handleTodoChange}
                                style={{ resize: "none" }}
                              ></IonTextarea>
                            </IonItem>
                          </IonCol>

                          <IonCol size="12">
                            <IonButton
                              onClick={updateTodo}
                              expand="block"
                              color="success"
                            >
                              <b>Update</b>
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>
              </IonModal>
            </IonGrid>
          </div>
        );
      })}
    </>
  );
};

export default EditTodo;

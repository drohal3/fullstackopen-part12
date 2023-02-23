import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => {
    // console.log('state', state)
    return state.notification;
  });

  let notificationClass = `notification ${notification.type}`;

  return notification.type !== "none" ? (
    <div id="notification" className={notificationClass}>
      <p> {notification.message} </p>
    </div>
  ) : null;
};

export default Notification;

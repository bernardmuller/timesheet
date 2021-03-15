// const shell = require('shelljs')
function redirectWindow () {    
      location.replace('http://localhost:8080/scheduled');        
}


function checkTime() {
    const date = new Date();
    const now = date.toISOString().slice(11,19);
    // console.clear()
    console.log(now)    
    return now;    
}



function askNotificationPermission() {
    // function to actually ask the permissions
    function handlePermission(permission) {
      // Whatever the user answers, we make sure Chrome stores the information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }

      // set the button to shown or hidden, depending on what the user answers
      // if(Notification.permission === 'denied' || Notification.permission === 'default') {
      //   notificationBtn.style.display = 'block';
      // } else {
      //   notificationBtn.style.display = 'none';
      // }
    }

    // Let's check if the browser supports notifications
    if (!"Notification" in window) {
      console.log("This browser does not support notifications.");
    } else {
      if(checkNotificationPromise()) {
        Notification.requestPermission()
        .then((permission) => {
          handlePermission(permission);
        })
      } else {
        Notification.requestPermission(function(permission) {
          handlePermission(permission);
        });
      }
    }
  }

  // Function to check whether browser supports the promise version of requestPermission()
  // Safari only supports the old callback-based version
function checkNotificationPromise() {
    try {
      Notification.requestPermission().then();
    } catch(e) {
      return false;
    }

    return true;
  }

  // wire up notification permission functionality to "Enable notifications" button




  function showNotification() {
    const notification = new Notification("Timesheet Web", {
        body: "Click to enter daily Submission..",
        
    })
    notification.onclick = (e) => {
        window.location.href = 'http://localhost:8080/scheduled'
        Notification.close()
    }
}

if (Notification.permission !== 'denied') {
    askNotificationPermission()
}

let now = setInterval(checkTime, 1000)
if (now === '20:11:30') {
  if(Notification.permission === "granted") {
      showNotification();
      redirectWindow()            
  }        
}





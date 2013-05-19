from time import sleep
import os
import time
import RPi.GPIO as GPIO


GPIO.setmode(GPIO.BCM)
GPIO.setup(23, GPIO.IN)

switchState = False
lastSwitchState = False

# millis
lastTime = 0;
debounceDelay = 50;

while (1):

    #showNext()
    # on an input change, showNext()

    millis = int(round(time.time() * 1000))

    # read the GPIO input
    switchInput = GPIO.input(23);

    print switchInput

    # if states are different set the time
    if (switchInput != switchState):
       lastTime = millis;

    # if last change was more than a while ago
    if ((millis - lastTime) > debounceDelay):
       formatter = "%r %r"
       #print formatter % (switchInput, switchState)
       if (switchInput != switchState):
          print "Dissimilar"
          switchState = switchInput;

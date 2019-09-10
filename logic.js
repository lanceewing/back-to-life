/**
 * Holds room logic functions.
 */
$.Logic = {

  process: function(verb, cmd, thing, e) {
    let newCommand = cmd;
    let thingId = thing.replace(' ','_');

    switch (verb) {
      case 'Pull':
        switch (thing) {
          case 'reaper':
            if (!$.roomData[11] || $.roomData[11] < 2) {
              $.ego.moveTo($.reaper.x - 50, 550, function() {
                $.reaper.ignore = false;
                $.reaper.moveTo($.reaper.x - 70, $.reaper.z, function() { $.reaper.ignore = true; });
                $.ego.moveTo($.reaper.x - 120, 550);
                $.roomData[11] = ($.roomData[11]? 2 : 1);
              });
            } else {
              $.ego.say("I think I'll let him be now.", 220);
            }
            break;
        }
        break;
    
      case 'Walk to':
        switch (thing) {
          case 'door':
            if ($.roomData[8]) {
              $.ego.moveTo($.activeDoor.offsetLeft + ($.activeDoor.offsetWidth / 2), $.ego.z, function() {
                if (!$.inside) {
                  $.activeDoor.children[0].style.transform = "rotateY(-120deg)";
                }
              });
              $.ego.moveTo($.activeDoor.offsetLeft + ($.activeDoor.offsetWidth / 2), $.activeDoor.offsetTop);
            } else {
              $.ego.say("The door is closed.", 220);
            }
            break;

          case 'left path':
          case 'right path':
            $.ego.stop();
            // Walk to be in front of the door/path.
            $.ego.moveTo(e.target.offsetLeft + (e.target.offsetWidth / 2), $.ego.z);
            // Now walk through the door/path.
            $.ego.moveTo(e.target.offsetLeft + (e.target.offsetWidth / 2), e.target.offsetTop);
            break;

          case 'road':
            $.ego.say("I should use the pedestrian crossing.", 220);
            break;

          case 'crossing':
            $.Game.userInput = false;
            $.ego.stop();
            $.ego.moveTo((e.pageX / $.scaleX), ((e.pageY / $.scaleY) - 27) * 2, function() {
              $.ego.moveTo($.ego.x, 1000);
            });
            break;
            
          default:
            $.ego.stop(true);
            var z = ((e.pageY / $.scaleY) - 27) * 2;
            if (z > 530) {
              $.ego.moveTo((e.pageX / $.scaleX), ((e.pageY / $.scaleY) - 27) * 2);
            } else {
              $.ego.moveTo((e.pageX / $.scaleX), 600);
            }
            break;
        }
        break;
    
      case 'Look at':
        switch (thing) {

          case 'left path':
          case 'right path':
            $.ego.say("The path makes a 90 degree turn around the corner.", 250);
            break;
            
          case 'me':
            $.ego.say("I'm the Grim Reaper.", 200);
            break;
            
          case 'reaper':
            // TODO: Searching pockets will find something.
            $.ego.say("It's me from the future.", 270);
            break;
            
          case 'doll':
            $.ego.say("This thing looks genuinely scary.", 200);
            break;

          case 'sign':
            $.ego.say("Its a street sign that says '" + $.sign.innerHTML + "'", 200);
            break;

          case 'crossing':
            $.ego.say("A safe way to cross the street, even for the Reaper.", 200);
            break;
            
          default:
            $.ego.say("It's just a " + thing + ".", 190);
            break;
        
        }
        break;
      
      // TODO: Replace Eat with something else. We don't need it.
      case 'Eat':
        switch (thing) {
          case 'chocolate coins':
            $.ego.say("Yummy! Plenty more where that came from.", 200);
            break;
            
          default:
            $.ego.say("Uh...  No.", 130);
            break;
        }
        break;
        
      case 'Talk to':
        switch (thing) {
          case 'reaper':
            $.ego.say("He's dead... unfortunately.", 200);
            break;
            
          case 'me':
            $.ego.say("Isn't that what I'm doing?", 150);
            break;
            
          default:
            $.ego.say("There was no reply.", 220);
            break;
        }
        break;
    
      case 'Open':
        switch (thing) {
          case 'drain':
            $.ego.say("They won't budge.", 230);
            break;
            
          case 'door':
            // Walk to be in front of the door/path.
            $.ego.moveTo($.activeDoor.offsetLeft + ($.activeDoor.offsetWidth / 2), $.ego.z, function() {
              if ($.roomData[9] || $.inside) {  // Unlocked
                if ($.roomData[8]) {
                  $.ego.say("The door is alrleady open.", 230);
                } else {
                  $.activeDoor.children[0].style.transform = ($.inside? "rotateY(180deg)" : "rotateY(-45deg)");
                  $.roomData[8] = true;
                }
              } else {
                $.ego.say("The door is locked.", 230);
              }
            });
            break;
            
          default:
            $.ego.say("It doesn't open.", 230);
            break;
        }
        break;
        
      case 'Close':
        switch (thing) {
          case 'door':
            if ($.roomData[8]) {
              $.ego.moveTo($.activeDoor.offsetLeft + ($.activeDoor.offsetWidth / 2), $.ego.z, function() {
                $.activeDoor.children[0].style.transform = "";
                $.roomData[8] = false;
              });
            }
            else {
              $.ego.say("It is already closed.", 220);
            }
            break;
            
          default:
            $.ego.say("It doesn't close.", 220);
            break;
        }
        break;
        
      case 'Use':
        if (cmd == verb) {
          newCommand = 'Use ' + thing + ' with ';
        } else {
          let thing2 = cmd.substring(4, cmd.indexOf(' with '));
          
          if (thing2.indexOf(' key' > -1)) {
            if ($.Game.hasItem(thing2)) {
              // Using a key.
              switch (thing) {
                case 'door':
                  $.ego.moveTo($.activeDoor.offsetLeft + ($.activeDoor.offsetWidth / 2), $.ego.z, function() {
                    if ($.roomData[9] || $.inside) {
                      $.ego.say("I don't want to lock it again.", 220);
                    } else {
                      let keyRooms = {'green key': 41};
                      if (keyRooms[thing2] == $.Game.room) {
                        // The key is for this door.
                        $.roomData[9] = true;
                        $.ego.say("The door is now unlocked.", 220);
                      } else {
                        $.ego.say("It's the wrong key for this door.", 220);
                      }
                    }
                  });
                  break;

                default:
                  $.ego.say("Nothing happened.", 220);
                  break;
              }
            } else {
              $.ego.say("I don't have the " + thing2, 220);
            }

          } else {
            $.ego.say("Nothing happened.", 220);
          }

          newCommand = verb;
        }
        break;
        
      case 'Give':
        if (cmd == verb) {
          newCommand = 'Give ' + thing + ' to ';
        } else {
          switch (cmd + thing) {
            case 'Give doll to reaper':
              $.Game.userInput = false;
              $.ego.moveTo($.ego.cx, 600, function() {
                $.ego.moveTo($.reaper.x, 600, function() {
                  $.reaper.moveTo($.reaper.x + 200, 600, function() {
                    $.reaper.setDirection($.Sprite.LEFT);
                    $.reaper.say("Get that thing away from me!!", 300, function() {
                      $.Game.fadeOut($.reaper.elem);
                      $.reaper.moveTo(850, 600, function() {
                        $.Game.props[0][0] = 0;
                        $.Game.props[4][0] = 4;
                        $.Game.addPropToRoom($.Game.props[4]);
                        $.Game.addObjEventListeners($.Game.props[4][7].elem);
                        $.reaper.remove();
                        $.ego.say("Whoa! He didn't like that.", 300);
                        $.Game.addToScore(84);
                      });
                    })
                  })
                });
              });
              break;
              
            default:
              if (thing == 'me') {
                $.ego.say("You lost me at 'Give'", 260);
              } else {
                $.ego.say("I think it said no.", 230);
              }
              break;
          }
          
          newCommand = verb;
        }
        break;
        
      case 'Pick up':
        if ($.Game.hasItem(thing)) {
          $.ego.say("I already have that.", 140);
        } else {
          switch (thing) {
            default:
              // Is item in the current room?
              if ($[thingId] && $[thingId].item) {
                if ($.Game.hasItem('backpack')) {
                  $.ego.moveTo($.ego.cx, 600, function() {
                    $.ego.moveTo($[thingId].x, 600, function() {
                      $.Game.getItem(thing);
                      $[thingId].remove();
                      $[thingId].propData[0] = 0;  // Clears the room number for the item.
                      $.Game.addToScore(15);
                    });
                  });
                } else {
                  $.ego.say("My hands are full. I need a bag of some kind.", 220);
                }
              }
              else {
                $.ego.say("I can't get that.", 220);
              }
              break;
          
          }
        }
        break;

      default:
        $.ego.say("Nothing happened.", 220);
        break;
    }
    
    return newCommand;
  }
};

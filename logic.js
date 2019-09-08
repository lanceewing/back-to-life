/**
 * Holds room logic functions.
 */
$.Logic = {

  process: function(verb, cmd, thing, e) {
    let newCommand = cmd;
    let thingId = thing.replace(' ','_');

    switch (verb) {
    
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
            
          case 'open drain':
            if ($.Game.hasItem('phone')) {
              $.ego.moveTo(e.target.offsetLeft + (e.target.offsetWidth / 2), $.ego.z, function() {
                  $.ego.moveTo($.ego.x, 540, function() {
                    $.Game.addToScore(20);
                    $.ego.say("Congratulations!! You've WON the game!",220, function() {
                      $.Game.gameOver = true;
                      $.Game.fadeOut($.controls);
                    });
                  });
              });
            } else {
              $.ego.say("I need to find my phone before I leave.", 220);
            }
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
        
          case 'open drain':
            $.ego.say("That's where I made my entry and where I hope to exit.", 300, function() {
              $.ego.say("Seems a bit high now.", 250);
            });
            break;

          case 'left path':
          case 'right path':
            $.ego.say("The path makes a 90 degree turn around the corner.", 250);
            break;
          
          case 'water':
            switch ($.Game.region[0]) {
              case 'Sewers':
                $.ego.say("Looks like raw sewerage.", 270);
                break;
              case 'Underworld':
                $.ego.say("Looks like lava to me.", 270);
                break;
              default:
                $.ego.say("Must be storm water.", 250);
                break;
            }
            break;
            
          case 'drain':
            $.ego.say("Sunlight shines down through the drain.", 200, function() {
              $.ego.say("I wouldn't be able to see down here without it.", 200);
            });
            break;
          
          case 'phone':
            if ($.Game.hasItem('phone')) {
              $.ego.say("My trusty phone, none the worst for wear.", 220, function() {
                $.ego.say("Hey! Looks like the Reaper made some long distance calls!", 300);
              });
            } else {
              $.ego.say("Seems that in his haste, the Grim Reaper dropped my phone.", 300);
            }
            break;
            
          case 'me':
            $.ego.say("I'm the Grim Reaper.", 200);
            break;
            
          case 'reaper':
            $.ego.say("It's the Grim Reaper.", 270);
            break;
            
          case 'man':
            $.ego.say("He looks a bit sick. He must be living down here.", 300);
            break;
            
          case 'doll':
            $.ego.say("This thing looks genuinely scary.", 200);
            break;
            
          case 'book':
            if ($.Game.hasItem('book')) {
              $.ego.say("It's a book on sewer survival.", 250, function() {
                $.ego.say("Who am I kidding? I'm never going to read this.", 300);
              });
            } else {
              $.ego.say("Someone must have dropped their book down the drain.", 300);
            }
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
            $.ego.say("Hey mate! Did you see a phone fall through that drain?", 300, function() {
              $.reaper.say("Finders reapers.", 200);
            });
            break;
            
          case 'man':
            if ($.Game.hasItem('book')) {
              $.ego.say("Hey, can I have that doll?", 240, function() {
                $.man.say("No, it's mine.", 200, function() {
                  $.ego.say("Would you like to trade?", 240, function() {
                    $.man.say("Depends what you've got.", 240);
                  });
                });
              });
            } else if ($.Game.hasItem('doll')) {
              $.man.say("Thanks again for the book. It's an interesting read.", 240);
            } else {
              $.ego.say("Hey, can I have that doll?", 240, function() {
                $.man.say("Yeah, sure.", 180);
              });
            }
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
              $.activeDoor.children[0].style.transform = ($.inside? "rotateY(180deg)" : "rotateY(-45deg)");
              $.roomData[8] = true;
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
          $.ego.say("Nothing happened.", 220);
          newCommand = verb;
        }
        break;
        
      case 'Give':
        if (cmd == verb) {
          newCommand = 'Give ' + thing + ' to ';
        } else {
          switch (cmd + thing) {
            case 'Give book to man':
              $.Game.userInput = false;
              $.ego.moveTo($.ego.cx, 600, function() {
                $.ego.moveTo($.man.x, 600, function() {
                  $.man.say("Thanks! That will be very useful down here.", 300);
                  $.Game.dropItem('book');
                  $.Game.addToScore(76);
                });
              });
              break;
              
            case 'Give chocolate coins to man':
              $.man.say("No thanks. I hate chocolate.", 200);
              break;
              
            case 'Give book to reaper':
              $.reaper.say("I'm immortal. I don't need a survival book.", 300);
              break;
              
            case 'Give chocolate coins to reaper':
              $.reaper.say("Do not tempt Death!", 300);
              break;
              
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
            case 'doll':
              $.Game.userInput = false;
              $.ego.moveTo($.ego.cx, 600, function() {
                $.ego.moveTo($.doll.x, 600, function() {
                  if ($.Game.hasItem('book')) {
                    $.man.say("Hey! That's mine!", 200);
                  } else {
                    $.man.say("All yours mate.", 200, function() {
                      $.Game.getItem('doll');
                      $.doll.remove();
                      $.Game.props[3][0] = 0;  // Clears the room number for the doll.
                      $.Game.userInput = true;
                      $.Game.addToScore(20);
                    });
                  }
                });
              });
              break;
              
            case 'blanket':
              $.man.say("Hey! That's mine!", 220, function() {
                $.man.say("I'll never part with my blanket.", 200);
              });
              break;
            
            case 'drain':
              $.ego.say("They won't budge.", 230);
              break;
              
            case 'book':
              $.ego.moveTo($.ego.cx, 600, function() {
                $.ego.moveTo($.book.x, 600, function() {
                  $.Game.getItem('book');
                  $.book.remove();
                  $.Game.props[5][0] = 0;  // Clears the room number for the book.
                  $.Game.addToScore(15);
                });
              });
              break;
              
            case 'phone':
              $.ego.moveTo($.ego.cx, 600, function() {
                $.ego.moveTo($.phone.x, 600, function() {
                  $.Game.getItem('phone');
                  $.phone.remove();
                  $.Game.props[4][0] = 0;  // Clears the room number for the phone.
                  $.Game.addToScore(15);
                });
              });
              break;
              
            case 'water':
              $.ego.say("I need a container.", 230);
              break;
              
            default:
              // Is item in the current room?
              if ($[thingId]) {
                $.ego.moveTo($.ego.cx, 600, function() {
                  $.ego.moveTo($[thingId].x, 600, function() {
                    $.Game.getItem(thing);
                    $[thingId].remove();
                    $[thingId].propData[0] = 0;  // Clears the room number for the item.
                    $.Game.addToScore(15);
                  });
                });
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

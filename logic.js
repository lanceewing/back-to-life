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
                $.Game.addToScore(15);
              });
            } else {
              $.ego.say("I think I'll let him be now.", 220);
            }
            break;
        }
        break;

      case 'Push':
        switch (thing) {
          case 'reaper':
            $.ego.say("Maybe I should try pulling.", 220);
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

                  if ($.Game.room == 40) {
                    // Black door, so game over.
                    $.ego.say("I see myself inside, and have told him to stay inside.", 250, function() {
                      $.Game.addToScore(15);
                      $.ego.say("He has agreed. Now no-one will catch The Death.", 250, function () {
                        for (let i=0; i<$.Game.objs.length; i++) {
                          $.Game.objs[i].remove();
                        }
                        $.Game.objs = [];
                        $.wrap.style.cursor = 'crosshair';
                        $.Game.fadeOut($.wrap);
                        $.Game.gameOver("Well done!!");
                      });
                    });
                  }
                }
              });
              if ($.Game.room != 40) {
                $.ego.moveTo($.activeDoor.offsetLeft + ($.activeDoor.offsetWidth / 2), $.activeDoor.offsetTop);
              }
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

          case 'light beam':
            $.ego.say("A beam of sun light breaks through the mist.", 250);
            break;

          case 'time machine':
            $.ego.say("It has a solar panel on it.", 250);
            break;

          case 'door':
            if ($.Game.room == 40) {
              $.ego.say("This black door looks vaguely familiar.", 250);
            } else {
              if ($.roomData[8]) {
                $.ego.say("The door is open.", 250);
              } else {
                $.ego.say("The door is closed.", 250);
              }
            }
            break;

          case 'ghost':
            if ($.roomData[12]) {
              $.ego.say("The old reaper told me I'm the reason they're dead.", 250);
            } else {
              $.ego.say("Why do I feel like I'm the reason they're ghosts?", 250, function() {
                $.ego.say("Why is everyone dead?", 200);
              });
            }
            break;

          case 'mist':
            if ($.Game.year == 2030) {
              $.ego.say("The mist is glowing green. It looks poluted.", 250);
            } else {
              $.ego.say("The mist is white, and clean.", 250);
            }
            break;

          case 'backpack':
            $.ego.say("Exactly what I need for carrying more things.", 300);
            break;

          case 'touch of death':
            $.ego.say("The label reads 'Aim, fire, instant death!'", 250, function() {
              $.ego.say("How morbid.", 140);
            });
            break;

          case 'black key':
            $.ego.say("It looks vaguely familiar.", 250);
            break;
            
          case 'me':
            $.ego.say("I look like the Grim Reaper. Is that who I am?", 200);
            break;
            
          case 'reaper':
            $.ego.say("He looks like me but older.", 270, function() {
              if ($.roomData[12]) {
                $.ego.say("I think he's fully dead now.", 270);
              }
              else {
                $.Game.userInput = true;
              }
            });
            break;

          case 'sign':
            $.ego.say("Its a street sign that says '" + $.sign.innerHTML + "'", 200);
            break;

          case 'crossing':
            $.ego.say("A safe way to cross the street, even for the Reaper.", 200);
            break;
            
          default:
            if (thing != "") {
              $.ego.say("It's just a " + thing + ".", 190);
            }
            break;
        
        }
        break;
      
      case 'Eat':
        switch (thing) {
          default:
            $.ego.say("Uh...  No.", 130);
            break;
        }
        break;
        
      case 'Talk to':
        switch (thing) {
          case 'reaper':
            if ($.roomData[12]) {
              $.ego.say("My spirit... I mean his spirit, has departed now... unfortunately.", 300);
            }
            else {
              let ghost = new Ghost(50);
              ghost.elem.style.opacity = 0.0;
              ghost.add();
              ghost.setPosition($.reaper.x, 0, 530);
              ghost.setDirection(Sprite.OUT);
              ghost.elem.style.transition = 'opacity 0.5s';
              ghost.elem.style.opacity = 0.3;

              ghost.say("Please, help me!", 200, function() {
                $.ego.say("Who are you?", 170, function() {
                  ghost.say("I am you, from the future.", 200, function() {
                    ghost.say("Five years ago, we got sick. Our kind call it The Death.", 300, function() {
                      ghost.say("Our father always told us to stay indoors when we got The Death.", 300, function() {
                        ghost.say("We should have listened to him!", 300, function() {
                          ghost.say("Instead we went outside, and all the humans caught The Death!", 300, function() {
                            ghost.say("For us, The Death is harmless, like a cold. For them it meant death.", 350, function() {
                              $.ego.say("So, you are me?", 170, function() {
                                ghost.say("Yes! And in the far future, we build a time machine to go back...", 300, function() {
                                  ghost.say("...and stop ourself from leaving our apartment.", 300, function() {
                                    ghost.say("But I failed. I didn't come back far enough, and now I'm dead.", 300, function() {
                                      $.ego.say("How did you die?", 170, function() {
                                        ghost.say("It doesn't matter. Its up to you now, to go back to 2025 and stop us.", 350, function() {
                                          ghost.say("If you stop us leaving our room, everyone else will come Back to Life.", 300, function() {
                                            ghost.say("I'm fading now. I'll be gone...  forever...  Good luck.", 300, function() {
                                              ghost.elem.style.opacity = 0.0;
                                              ghost.elem.style.display = 'none';
                                              $.Game.userInput = true;
                                              $.roomData[12] = true;
                                              $.Game.addToScore(15);
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    }); 
                  });
                });
              });
            }
            break;
            
          case 'me':
            $.ego.say("Isn't that what I'm doing?", 150);
            break;

          case 'ghost':
            $.ego.say("Woooooo!!!", 150);
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
                  $.ego.say("The door is already open.", 230);
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
          
          if (thing2.indexOf(' key') > -1) {
            if ($.Game.hasItem(thing2)) {
              // Using a key.
              switch (thing) {
                case 'door':
                  $.ego.moveTo($.activeDoor.offsetLeft + ($.activeDoor.offsetWidth / 2), $.ego.z, function() {
                    if ($.roomData[9] || $.inside) {
                      $.ego.say("I don't want to lock it again.", 220);
                    } else {
                      let keyRooms = {'green key': 41, 'black key': 40};
                      if (keyRooms[thing2] == $.Game.room) {
                        if ((thing2 == 'black key') && ($.Game.year == 2030)) {
                          $.ego.say("It's the right key, but someone has recently damaged the lock. The key won't go in.", 370);
                        } else {
                          // The key is for this door.
                          $.roomData[9] = true;
                          $.ego.say("The door is now unlocked.", 220);
                          $.Game.addToScore(15);
                        }
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
            if (thing2 == 'touch of death') {
              switch (thing) {
                case 'me':
                  $.ego.say("It doesn't work on me.", 200);
                  break;

                case 'reaper':
                  $.ego.say("Strange... It doesn't work on him.", 200);
                  break;

                case 'ghost':
                  $.ego.say("They're already dead.", 200);
                  break;
                
                default:
                  $.ego.say("Nothing happened.", 220);
                  break;
              }
            }
            else if (thing2 == 'time machine') {
              switch (thing) {
                case 'light beam':
                  $.ego.moveTo(e.target.offsetLeft + (e.target.offsetWidth / 2), $.ego.z, function() {
                    $.ego.say("The time machine is charging...", 220, function() {
                      $.Game.addToScore(15);
                      $.ego.elem.style.opacity = 0.5;
                      $.ego.say("Hey! Wait! What is it doing to me?.", 220, function() {
                        $.Game.fadeOut($.ego.elem);
                        setTimeout(function() {
                          $.Game.initActors();
                          $.ego.year = 2025;
                          $.Game.userInput = true;
                        }, 500);
                      });
                    });
                  });
                  break;

                case 'mist':
                  $.ego.say("There isn't enough light coming through the mist.", 300);
                  break;
                
                default:
                  $.ego.say("Nothing happened.", 220);
                  break;
              }
            }
          }

          newCommand = verb;
        }
        break;
        
      case 'Give':
        if (cmd == verb) {
          newCommand = 'Give ' + thing + ' to ';
        } else {
          switch (cmd + thing) {
              
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
                // Ego can only hold max of two items, unless he has the backpack.
                if ($.Game.hasItem('backpack') || (thing == 'backpack') || ($.items.children.length < 2)) {
                  $.ego.moveTo($.ego.cx, 600, function() {
                    $.ego.moveTo($[thingId].x, 600, function() {
                      $.Game.getItem(thing);
                      $[thingId].remove();
                      $[thingId].propData[0] = 0;  // Clears the room number for the item.
                      $.Game.addToScore(15);

                      if (thing == 'backpack') {
                        $.ego.pack = 'rgb(20, 30, 20)';
                        $.ego.canvas = $.ego.buildCanvas();
                        $.ego.say("Nice fit!", 150);
                      }
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

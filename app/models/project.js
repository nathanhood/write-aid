'use strict';

var projectCollection = global.nss.db.collection('projects');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Mongo = require('mongodb');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var rimraf = require('rimraf');
var request = require('request');
var _ = require('lodash');
var moment = require('moment');

class Project {
  static create(obj, fn){
    var project = new Project();
    project._id = Mongo.ObjectID(obj._id);
    project.userId = Mongo.ObjectID(obj.userId);
    project.dateCreated = new Date();
    project.title = obj.title;
    project.type = obj.type;
    project.draftText = null;
    project.draftTextRecord = [];
    project.draftAudio = null;
    project.boards = [];
    project.collaborators = [];
    project.critics = [];
    project.privacy = obj.privacy;
    project.status = obj.status;

    project.save(()=>fn(project));
  }

  static findById(id, fn){
    Base.findById(id, projectCollection, Project, fn);
  }

  static findAllByUserId(userId, fn){
    Base.findAllByUserId(userId, projectCollection, Project, fn);
  }

  static findByBoardId(boardId, fn){
    boardId = Mongo.ObjectID(boardId);
    projectCollection.findOne({boards:boardId}, (err, project)=>{
      fn(project);
    });
  }

  static formatProjectDates(projects, fn){
    projects = projects.map(proj=>{
      proj.dateCreated = moment(proj.dateCreated).format('MMMM Do YYYY, h:mm a');
      return proj;
    });
    fn(projects);
  }

  static sortProjectsByDate(projects, fn){
    projects.sort((proj1, proj2)=>{
      var p1 = proj1.dateCreated.getTime();
      var p2 = proj2.dateCreated.getTime();
      if ( p1 < p2 ) {
        return 1;
      } else if ( p1 > p2 ) {
        return -1;
      } else {
        return 0;
      }
    });
    fn(projects);
  }

  static findManagedCollaborations(projects, fn){
    var managedCollabs = [];
    projects.forEach(proj=>{
      if (proj.collaborators.length > 0) {
        managedCollabs.push(proj);
      }
    });
    fn(managedCollabs);
  }

  static takeFiveProjects(projects, fn){
    var recentProjects = [];
    if(projects.length >= 5){
      for(var i = 0; i < 5; i++){
        recentProjects.push(projects[i]);
      }
      fn(recentProjects);
    }else{
      fn(projects);
    }
  }

  static inviteCollaborator(projId, obj, fn){
    var messageInfo = obj;
    messageInfo.projId = projId;
    sendVerificationEmail(messageInfo, fn);
  }

  static findCollaborationsByUserId(userId, fn){
    projectCollection.find({collaborators:userId}).toArray((err, projects)=>{
      fn(projects);
    });
  }

  save(fn){
    projectCollection.save(this, ()=>fn());
  }

  destroy(fn){
    var audioPath = path.normalize(`${__dirname}/../static/audio/${this.userId}/${this._id}`);
    var imagePath = path.normalize(`${__dirname}/../static/img/${this.userId}/${this._id}`);
    rimraf(audioPath, (err)=>{
      rimraf(imagePath, (err)=>{
        projectCollection.remove({_id:this._id}, (err, writeResult)=>{
          fn(writeResult);
        });
      });
    });
  }

  removeCollaborator(collaboratorId, fn){
    this.collaborators = this.collaborators.map(c=>{
      return c.toString();
    });
    _.pull(this.collaborators, collaboratorId).valueOf();
    this.collaborators = this.collaborators.map(c=>{
      return Mongo.ObjectID(c);
    });
    fn(this);
  }

  updateTitle(obj, fn){
    this.title = obj.title;
    fn(this);
  }

  addCollaborator(collaboratorId, fn){
    this.collaborators.push(collaboratorId);
    fn(this);
  }

  addCritic(criticId, fn){
    this.critics.push(criticId);
    fn(this);
  }

  updatePrivacy(obj, fn){
    this.privacy = obj.privacy;
    fn(this);
  }

  updateStatus(obj, fn){
    this.status = obj.status;
    fn(this);
  }

  addBoardId(boardId, fn){
    this.boards.push(boardId);
    fn(this);
  }

  updateDraftText(obj, fn){
    this.draftText = obj.draft;
    fn(this);
  }

  addDraftTextRecord(text, userObj, fn){
    this.draftText = text;
    var obj = {};
    obj.date = new Date();
    obj.text = text;
    obj.userId = userObj._id;
    obj.id = createId();
    if (Object.keys(userObj.facebook).length > 0) {
      console.log('facebook');
      obj.name = userObj.facebook.displayName;
    } else if (Object.keys(userObj.twitter).length > 0) {
      console.log('twitter');
      obj.name = userObj.twitter.displayName;
    } else {
      obj.name = userObj.local.email;
    }
    this.draftTextRecord.push(obj);
    fn(this);
  }

  updateDraftAudio(audio, fn){
    if(this.draftAudio){
      var normPath = path.normalize(`${__dirname}/../static/${this.draftAudio.filePath}`);

      rimraf(normPath, (err)=>{
        if(audio.size){
          var name = crypto.randomBytes(12).toString('hex') + path.extname(audio.originalFilename).toLowerCase();
          var file = `/audio/${this.userId}/${this._id}/${name}`;

          var newAudio = {};
          newAudio.fileName = name;
          newAudio.filePath = file;
          newAudio.origFileName = audio.originalFilename;

          var userDir = `${__dirname}/../static/audio/${this.userId}`;
          var projDir = `${userDir}/${this._id}`;
          var fullDir = `${projDir}/${name}`;

          if(!fs.existsSync(userDir)){fs.mkdirSync(userDir);}
          if(!fs.existsSync(projDir)){fs.mkdirSync(projDir);}

          fs.renameSync(audio.path, fullDir);
          this.draftAudio = newAudio;
          fn(this);

        }else{
          fn(null);
        }
      });
    } else {
      if(audio.size){
        var name = crypto.randomBytes(12).toString('hex') + path.extname(audio.originalFilename).toLowerCase();
        var file = `/audio/${this.userId}/${this._id}/${name}`;

        var newAudio = {};
        newAudio.fileName = name;
        newAudio.filePath = file;
        newAudio.origFileName = audio.originalFilename;

        var userDir = `${__dirname}/../static/audio/${this.userId}`;
        var projDir = `${userDir}/${this._id}`;
        var fullDir = `${projDir}/${name}`;

        if(!fs.existsSync(userDir)){fs.mkdirSync(userDir);}
        if(!fs.existsSync(projDir)){fs.mkdirSync(projDir);}

        fs.renameSync(audio.path, fullDir);
        this.draftAudio = newAudio;
        fn(this);

      }else{
        fn(null);
      }
    }
  }

  formatDraftRecordDates(fn){
    var records = [];
    this.draftTextRecord.forEach(record=>{
      record.date = moment(record.date).format('MMMM Do YYYY, h:mm a');
      records.unshift(record);
    });
    fn(records);
  }


}

function createId(){
  var text='';
  var possible = '0123456789abcdefghijklmnopqrstuvwxyz0123456789';
  for( var i=0; i < 6; i++ ){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  return text;
}

function sendVerificationEmail(message, fn){
  var key = process.env.MAILGUN;
  var url = 'https://api:' + key + '@api.mailgun.net/v2/sandboxca5bcce9a29f4c5da3e715d4fa6b3ae2.mailgun.org/messages';
  var post = request.post(url, function(err, response, body){
    fn(message); //callback from static create function being called
  });

  var form = post.form();
  form.append('from', 'admin@musecollective.com');
  form.append('to', message.email);
  form.append('subject', 'Muse[collective]: Collaboration Invite');
  form.append('html', `<p>You have been invited by ${message.inviteeName} to collaborate on a Muse[collectve] project.</p>
                      <br>
                      <h4>Message from ${message.inviteeName}:</h4>
                      <p>${message.personalMessage}</p>
                      <a href="http://musecollective.nathanhood.me/confirmInvite/${message.projId}">Click to Join Project</a>`);
}


module.exports = Project;

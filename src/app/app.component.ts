import { Component, OnInit, ViewChild } from '@angular/core';
import { load } from '@tensorflow-models/mobilenet';
import * as ml5 from 'ml5';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('videoRef') videoRef;
  classifier: any;
  label: any;
  mobilenet: any;

  ngAfterContentInit(): void {
    this.startVideo();
    this.setup();
  }

  setup(): any {
    this.mobilenet = ml5.featureExtractor('MobileNet', this.modelReady);
  }

  detectFrame = (video) => {
    // model.detect(video).then(predictions => {
    //   console.log(predictions);
    //   requestAnimationFrame(() => {
    //     this.detectFrame(video, model);
    //   });
    // });
  };

  modelReady() {
    console.log('Model is ready!!!');
  }

  videoReady() {
    console.log('Video is ready!!!');
  }

  whileTraining(loss) {
    if (loss == null) {
      console.log('Training Compe');
      this.classifier.classify(this.gotResults);
    } else {
      console.log(loss);
    }
  }


  gotResults(error, result) {
    if (error) {
      console.error(error);
    } else {
      this.label = result;
      this.classifier.classify(this.gotResults);
    }
  }

  getFrame(label) {
    var video = this.videoRef.nativeElement;
    this.mobilenet = ml5.featureExtractor('MobileNet', this.modelReady);
    var classifier = this.mobilenet.classification(video, this.videoReady);
    classifier.addImage(label);
  }

  train() {
    this.classifier.train(this.whileTraining);
  }

  startVideo() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user"
          }
        })
        .then(stream => {
          window["stream"] = stream;
          this.videoRef.nativeElement.srcObject = stream;
          return new Promise((resolve, reject) => {
            this.videoRef.nativeElement.onloadedmetadata = () => {
              resolve();
            };
          });
        });
    }
  }


}



export default class AudioRecorder {
  private mediaRecorder: null | MediaRecorder = null;
  private audioBlobList: Blob[] = [];
  private stream: null | MediaStream = null;

  public async start(): Promise<void> {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      throw new Error(
        "mediaDevices API or getUserMedia method is not supported in this browser.",
      );
    }

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.audioBlobList = [];

    this.mediaRecorder.addEventListener("dataavailable", (event: BlobEvent) => {
      this.audioBlobList.push(event.data);
    });

    this.mediaRecorder.start();
  }

  public stop(): Promise<void | Blob> {
    return new Promise((resolve) => {
      const mimeType = this.mediaRecorder?.mimeType;

      this.mediaRecorder?.addEventListener("stop", () => {
        resolve(new Blob(this.audioBlobList, { type: mimeType }));
      });

      this.mediaRecorder?.stop();
      this.stopStream();
      this.resetRecordingProperties();
    });
  }

  private stopStream(): void {
    this.stream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
  }

  private resetRecordingProperties(): void {
    this.mediaRecorder = null;
    this.stream = null;
  }

  public cancel(): void {
    this.mediaRecorder?.stop();
    this.stopStream();
    this.resetRecordingProperties();
  }

  public getErrorMessage(error: Error): string {
    switch (error.name) {
      case "AbortError": // error from navigator.mediaDevices.getUserMedia
        return "An AbortError has occured.";

      case "NotAllowedError": // error from navigator.mediaDevices.getUserMedia
        return "A NotAllowedError has occured. User might have denied permission.";

      case "NotFoundError": // error from navigator.mediaDevices.getUserMedia
        return "A NotFoundError has occured.";

      case "NotReadableError": // error from navigator.mediaDevices.getUserMedia
        return "A NotReadableError has occured.";

      case "SecurityError": // error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
        return "A SecurityError has occured.";

      case "TypeError": // error from navigator.mediaDevices.getUserMedia
        return "A TypeError has occured.";

      case "InvalidStateError": // error from the MediaRecorder.start
        return "An InvalidStateError has occured.";

      case "UnknownError": // error from the MediaRecorder.start
        return "An UnknownError has occured.";

      default:
        return error.message;
    }
  }
}

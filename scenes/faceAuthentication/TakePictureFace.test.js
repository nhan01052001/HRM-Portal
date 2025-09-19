import TakePictureFace from './TakePictureFace';

describe('TakePictureFace', () => {
    let cameraMock;
    let takePictureAsyncMock;

    beforeEach(() => {
        takePictureAsyncMock = jest.fn();
        cameraMock = {
            takePictureAsync: takePictureAsyncMock
        };
    });

    it('should take a picture and log the URI', async () => {
        const instance = new TakePictureFace();
        instance.camera = cameraMock;

        const options = { quality: 0.5, base64: true };
        const capturedImageData = { uri: 'captured_image_uri' };
        takePictureAsyncMock.mockResolvedValueOnce(capturedImageData);

        await instance.takePicture();

        expect(takePictureAsyncMock).toHaveBeenCalledWith(options);
        expect(console.log).toHaveBeenCalledWith('captured_image_uri');
    });

    it('should not take a picture if camera is not available', async () => {
        const instance = new TakePictureFace();
        instance.camera = null;

        await instance.takePicture();

        expect(takePictureAsyncMock).not.toHaveBeenCalled();
        expect(console.log).not.toHaveBeenCalled();
    });
});

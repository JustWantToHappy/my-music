//工具函数
//将File文件转为dataURL字符串
export const fileToDataURL = (file: File): Promise<string> => {
    var promise = new Promise<string>((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            return resolve(e.target?.result as string);
        }
    });
    return promise;
}
//将dataURL转为Image对象
export const dataURLToImage = (dataURL: string | null | undefined): Promise<HTMLImageElement> => {
    var img = new Image();
    var promise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.src = dataURL as string;
        img.onload = function () {
            return resolve(img);
        }
    });
    return promise;
}
import * as Three from '../three.js/three.module.js';
import { OrbitControls } from '../three.js/OrbitControls.js'
import { VertexNormalsHelper } from '../three.js/VertexNormalsHelper.js'

class App {
    constructor() {
        // id가 webgl-container인 div요소를 얻어와서, 상수에 저장 
        const divContainer = document.querySelector("#webgl-container");
        // 얻어온 상수를 클래스 필드에 정의
        // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
        this._divContainer = divContainer;

        // 렌더러 생성, Three.js의 WebGLRenderer 클래스로 생성
        // antialias를 활성화 시키면 렌더링될 때 오브젝트들의 경계선이 계단 현상 없이 부드럽게 표현된다.
        const renderer = new Three.WebGLRenderer({ antialias: true });
        // window의 devicePixelRatio 속성을 얻어와 PixelRatio 설정
        // 디스플레이 설정의 배율값을 얻어온다.
        renderer.setPixelRatio(window.devicePixelRatio);
        // domElement를 자식으로 추가.
        // canvas 타입의 DOM 객체이다.
        // 문서 객체 모델(DOM, Document Object Model)은 XML이나 HTML 문서에 접근하기 위한 일종의 인터페이스.
        divContainer.appendChild(renderer.domElement);
        // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
        this._renderer = renderer;

        // Scene 객체 생성
        const scene = new Three.Scene();
        // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
        this._scene = scene;

        // 카메라 객체를 구성
        this._setupCamera();
        // 조명 설정
        this._setupLight();
        // 3D 모델 설정
        this._setupModel();
        // 마우스 컨트롤 설정
        this._setupControls();

        // 창 크기가 변경될 때 발생하는 이벤트인 onresize에 App 클래스의 resize 메서드를 연결한다.
        // this가 가리키는 객체가 이벤트 객체가 아닌 App클래스 객체가 되도록 하기 위해 bind로 설정한다.
        // onresize 이벤트가 필요한 이유는 렌더러와 카메라는 창 크기가 변경될 때마다 그 크기에 맞게 속성값을 재설정해줘야 한다.
        window.onresize = this.resize.bind(this);
        // onresize 이벤트와 상관없이 생성자에서 resize 메서드를 호출한다.
        // 렌더러와 카메라의 속성을 창크기에 맞게 설정해준다. 
        this.resize();

        // render 메서드를 requestAnimationFrame이라는 API에 넘겨줘서 호출해준다.
        // render 메서드 안에서 쓰이는 this가 App 클래스 객체를 가리키도록 하기 위해 bind 사용
        requestAnimationFrame(this.render.bind(this));
    }

    _setupCamera() {
        // 3D 그래픽을 출력할 영역 width, height 얻어오기
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        // 얻어온 크기를 바탕으로 Perspective 카메라 객체 생성
        const camera = new Three.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 3;
        // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
        this._camera = camera;

        // 카메라에 조명 적용을 위해 Scend 자식으로 Camera 추가
        this._scene.add(camera);
    }

    _setupLight() {
        // aoMap이 적용되기 위해서 ambient light가 필요하다.
        // ambient light : 모든 mesh의 전체 면에 대해서 균일하게 비추는 광원
        const ambientLight = new Three.AmbientLight(0xffffff, 0.2);
        this._scene.add(ambientLight);

        // 광원 색상 설정
        const color = 0xffffff;
        // 광원 세기 설정
        const intensity = 1;
        // 위 설정을 바탕으로 Directional 광원 객체 생성
        const light = new Three.DirectionalLight(color, intensity);
        // 광원 위치 설정
        light.position.set(-1, 2, 4);
        // // Scene객체에 광원 추가
        // this._scene.add(light);

        // 카메라에 조명 적용
        this._camera.add(light);
    }

    ////////////////////////////////////////////////////////////////////////////////////
    // // MeshStandardMaterial 사용하고 Texture 속성 없이 Texture를 맵핑하는 _setupModel 메서드
    // _setupModel() {
    //     const textureLoader = new Three.TextureLoader();
    //     const map = textureLoader.load(
    //         // 이미지 경로 지정
    //         "../three.js/uv_grid_opengl.jpg",
    //         // 텍스처 로드가 성공되면 호출되는 콜백함수 설정
    //         texture => { }
    //     );

    //     const material = new Three.MeshStandardMaterial({
    //         map: map,
    //     });

    //     const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1), material);
    //     box.position.set(-1, 0, 0);
    //     this._scene.add(box);

    //     const sphere = new Three.Mesh(new Three.SphereGeometry(0.7, 32, 32), material);
    //     sphere.position.set(1, 0, 0);
    //     this._scene.add(sphere);
    // }
    ////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////
    // // Texture 속성을 설정하는 _setupModel 메서드
    // // 텍스처의 속성은 텍스처 객체가 생성된 이후에 설정되어야 한다.
    // // 이 메서드에서는 텍스처 객체 생성이 완료된 직후에 호출되는 콜백함수에서 설정하는 방법을 선택하였다.
    // _setupModel() {
    //     const textureLoader = new Three.TextureLoader();
    //     const map = textureLoader.load(
    //         // 이미지 경로 지정
    //         "../three.js/uv_grid_opengl.jpg",
    //         // 텍스처 로드가 성공되면 호출되는 콜백함수 설정
    //         texture => {
    //             // x, y축 방향으로 동일한 이미지가 4번씩 반복된다.
    //             texture.repeat.x = 4;
    //             texture.repeat.y = 4;

    //             //texture.wrapS = Three.RepeatWrapping;
    //             //texture.wrapT = Three.RepeatWrapping;
    //             texture.wrapS = Three.MirroredRepeatWrapping;
    //             texture.wrapT = Three.MirroredRepeatWrapping;

    //             //// 텍스처 이미지가 렌더링될 때 사용할 필터에 대한 속성
    //             // 텍스처 이미지의 원래 크기보다 더 크게 확대되어 렌더링될때 사용하는 magFilter, 기본값은 LinearFilter이다.
    //             texture.magFilter = Three.LinearFilter;
    //             // 텍스처 이미지의 원래 크기보다 축소될 때 사용하는 minFilter, 기본값은 NearestMipMapLinearFilter이다.
    //             texture.minFilter = Three.NearestMipMapLinearFilter;

    //             // mipMap: 원래의 이미지 크기를 절반으로 줄여가며 미리 만들어 놓은 이미지 셋, 보통 mipMap을 사용한 경우가 렌더링 품질이 좋다.
    //             // 하지만 밉멥의 생성을 위한 메모리 사용량이 상당하고 렌더링 시 하나의 픽셀값을 결정하는 계산에 필요한 연산량이 각 속성에 따라 모두 다르므로 사용하는 텍스처 맵핑의 크기 등에 따라서 적절한 minFilter의 속성값을 지정해서 사용해야 한다.
    //         }
    //     );

    //     const material = new Three.MeshStandardMaterial({
    //         map: map,
    //     });

    //     const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1), material);
    //     box.position.set(-1, 0, 0);
    //     this._scene.add(box);

    //     const sphere = new Three.Mesh(new Three.SphereGeometry(0.7, 32, 32), material);
    //     sphere.position.set(1, 0, 0);
    //     this._scene.add(sphere);
    // }
    ////////////////////////////////////////////////////////////////////////////////////



    ////////////////////////////////////////////////////////////////////////////////////
    // 텍스쳐 속성 alphaMap, aoMap, displacementMap, lightMap, metalnessMap, normalMap, roughnessMap 적용
    _setupModel() {
        const textureLoader = new Three.TextureLoader();
        const map = textureLoader.load("../images/glass/Glass_Window_002_basecolor.jpg");
        const mapAO = textureLoader.load("../images/glass/Glass_Window_002_ambientOcclusion.jpg");
        const mapHeight = textureLoader.load("../images/glass/Glass_Window_002_height.png");
        const mapNormal = textureLoader.load("../images/glass/Glass_Window_002_normal.jpg");
        const mapRoughness = textureLoader.load("../images/glass/Glass_Window_002_roughness.jpg");
        const mapMetalic = textureLoader.load("../images/glass/Glass_Window_002_metallic.jpg");
        const mapAlpha = textureLoader.load("../images/glass/Glass_Window_002_opacity.jpg");

        const material = new Three.MeshStandardMaterial({
            map: map,

            // normalMap : 법선 벡터를 이미지화 해서 저장해 둔 것
            normalMap: mapNormal,

            // displacementMap : 실제로 mesh의 지오메트리의 좌표를 변형시켜 입체감을 표현
            // 이 맵 이미지의 픽셀값이 밝을 수록 좌표의 변위가 커진다.
            // displacementMap이 실제 지오메트리의 구성 좌표를 변경시키기 때문에 표면에 대한 구성 좌표가 제공되어져야 한다.
            // 이를 위해 지오메트리 표면을 여러 개의 면으로 분할시켜줘야 한다.
            displacementMap: mapHeight,
            // 변위 효과를 20%만 적용
            displacementScale: 0.2,
            // 변위에의해 박스가 분리되는 것을 조정
            displacementBias: -0.15,

            // aoMap : 텍스처 이미지에 미리 음영 효과를 그려넣은 것
            // aoMap이 적용되기 위해서 ambient light가 필요하다.
            // ambient light : 모든 mesh의 전체 면에 대해서 균일하게 비추는 광원
            // aoMap이 적용되기 위해서 지오메트리 속성에 UV데이터를 지정해줘야 한다.
            aoMap: mapAO,
            // aoMap 강도 설정
            aoMapIntensity: 10,

            // roughnessMap : 거칠기에 대한 재질 적용
            roughnessMap: mapRoughness,
            // 값이 작아지면 거칠기가 낮아져서 더욱 반짝이는 플라스틱 느낌이 난다.
            roughness: 0.5,

            // metalnessMap : 금속 재질에 대한 느낌 부여
            metalnessMap: mapMetalic,
            // 기본값이 0이라 값을 높혀줘야 matalnessMap의 효과가 적용된다.
            metalness: 0.5
        });

        // displacementMap 적용을 위해 지오메트리 표면을 여러 개의 면으로 분할시켜줘야 한다.
        const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1, 256, 256, 256), material);
        box.position.set(-1, 0, 0);
        // aoMap이 적용되기 위해서 지오메트리 속성에 UV데이터를 지정
        box.geometry.attributes.uv2 = box.geometry.attributes.uv
        this._scene.add(box);

        // // VertexNormalsHelper로 법선 표시
        // const boxHelper = new VertexNormalsHelper(box, 0.1, 0xffff00);
        // this._scene.add(boxHelper);

        const sphere = new Three.Mesh(new Three.SphereGeometry(0.7, 512, 512), material);
        sphere.position.set(1, 0, 0);
        // aoMap이 적용되기 위해서 지오메트리 속성에 UV데이터를 지정
        sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
        this._scene.add(sphere);

        // // VertexNormalsHelper로 법선 표시
        // const sphereHelper = new VertexNormalsHelper(sphere, 0.1, 0xffff00);
        // this._scene.add(sphereHelper);
    }
    ////////////////////////////////////////////////////////////////////////////////////



    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }

    resize() {
        // 3D 그래픽을 출력할 영역 width, height 얻어오기
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        // 출력할 영역 width, height로 aspect 계산하여 카메라 aspect를 설정
        this._camera.aspect = width / height;
        // 변경된 aspect를 바탕으로 ProjectionMatrix 업데이트
        this._camera.updateProjectionMatrix();

        // 출력 영역 크기를 바탕으로 렌더러 크기 설정
        this._renderer.setSize(width, height);
    }

    render(time) {
        // Scene을 카메라 시점으로 렌더링하라는 코드
        this._renderer.render(this._scene, this._camera);
        // update 메서드 안에서는 time 인자를 바탕으로 애니메이션 효과 발생
        this.update(time);
        // requestAnimationFrame을 통하여 render 메서드가 반복적으로 호출될 수 있다.
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        // 밀리초에서 초로 변환
        time *= 0.001;
    }
}

window.onload = function () {
    new App();
}
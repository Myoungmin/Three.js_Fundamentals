import * as Three from '../three.js/three.module.js';

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
        camera.position.z = 50;
        // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
        this._camera = camera;
    }

    _setupLight() {
        // 광원 색상 설정
        const color = 0xffffff;
        // 광원 세기 설정
        const intensity = 1;
        // 위 설정을 바탕으로 Directional 광원 객체 생성
        const light = new Three.DirectionalLight(color, intensity);
        // 광원 위치 설정
        light.position.set(-1, 2, 4);
        // Scene객체에 광원 추가
        this._scene.add(light);
    }

    _setupModel() {
        const solarSystem = new Three.Object3D();
        this._scene.add(solarSystem);

        const radius = 1;
        const widthSegments = 12;
        const heightSegments = 12;
        const sphereGeometry = new Three.SphereGeometry(radius, widthSegments, heightSegments);

        const sunMaterial = new Three.MeshPhongMaterial({
            emissive: 0xffff00, flatshading: true
        });

        // 태양 Mesh 생성, 크기 조정, solarSystem Object3D에 추가
        const sunMesh = new Three.Mesh(sphereGeometry, sunMaterial);
        sunMesh.scale.set(3, 3, 3);
        solarSystem.add(sunMesh);

        // solarSystem Object3D 자식 객체로 earthOrbit Object3D 추가
        const earthOrbit = new Three.Object3D();
        solarSystem.add(earthOrbit);

        const earthMaterial = new Three.MeshPhongMaterial({
            color: 0x2233ff, emissive: 0x112244, flatshading: true
        });

        // 지구 Mesh 생성
        const earthMesh = new Three.Mesh(sphereGeometry, earthMaterial);
        // earthOrbit Object3D 위치 조정
        earthOrbit.position.x = 10;
        // earthOrbit Object3D에 지구 Mesh 추가
        earthOrbit.add(earthMesh);

        // earthOrbit Object3D 자식 객체로 moonOrbit Object3D 추가
        const moonOrbit = new Three.Object3D();
        moonOrbit.position.x = 2;
        earthOrbit.add(moonOrbit);

        const moonMaterial = new Three.MeshPhongMaterial({
            color: 0x888888, emissive: 0x222222, flatshading: true
        });

        // 달 Mesh 생성
        const moonMesh = new Three.Mesh(sphereGeometry, moonMaterial);
        // 달 Mesh 크기 조정
        moonMesh.scale.set(0.5, 0.5, 0.5);
        // moonOrbit Object3D에 달 Mesh 추가
        moonOrbit.add(moonMesh);
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
        // 시간값으로 큐브 회전
        this._cube.rotation.x = time;
        this._cube.rotation.y = time;
    }
}

window.onload = function () {
    new App();
}
import * as Three from '../three.module.js';
import { OrbitControls } from '../OrbitControls.js';

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
        // OrbitControls 클래스 사용
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
        camera.position.z = 15;
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

    // _setupModel() {
    //     // 큐브모양 geometry, 회색 material를 이용하여 Mesh 객체 생성
    //     // BoxGeometry에 width, height, depth 모두 2분할 적용
    //     //const geometry = new Three.BoxGeometry(1, 1, 1, 2, 2, 2);

    //     // CircleGeometry 객체를 생성하는데 필요한 인자
    //     // 반지름, 분할 개수(클수록 완전한 원), 시작 각도, 원을 구성하는 각도 크기
    //     //const geometry = new Three.CircleGeometry(0.9, 16, Math.PI/2, Math.PI);

    //     // ConeGeometry 객체를 생성하는데 필요한 인자
    //     // 밑면 반지름, 원뿔의 높이, 밑면 원 분할 개수, 원뿔 높이 방향에대한 분할 개수, 밑면 개방 여부, 밑면 시작 각도, 밑면 원을 구성하는 각도 크기
    //     //const geometry = new Three.ConeGeometry(0.5, 1.6, 16, 9, true, 0, Math.PI);

    //     // CylinderGeometry 객체를 생성하는데 필요한 인자
    //     // top 반지름, bottom 반지름, 원통의 높이, 원통 둘레방향에 대한 분할 개수, 높이 방향에 대한 분할 개수, 윗면 밑면 개방 여부, 시작 각도, 구성하는 각도 크기
    //     //const geometry = new Three.CylinderGeometry(0.9, 0.9, 1.6, 32, 12, true, 0, Math.PI);

    //     // SphereGeometry 객체를 생성하는데 필요한 인자
    //     // 반지름, 수평방향 분할값, 수직방향 분할값, 수평방향 시작각도, 구성각도, 수직방향 시작각도, 구성각도, 
    //     //const geometry = new Three.SphereGeometry(0.9, 32, 12, 0, Math.PI, 0, Math.PI/2);

    //     // RingGeometry 객체를 생성하는데 필요한 인자
    //     // 내부 반지름, 외부 반지름, 가장자리 둘레방향 분할수, 내부방향에 대한 분할수, 시작각도, 구성각도
    //     //const geometry = new Three.RingGeometry(0.2, 1, 6, 2, 0, Math.PI);

    //     // PlaneGeometry 객체를 생성하는데 필요한 인자
    //     // width, height, width 방향 분할, height 방향 분할
    //     // PlaneGeometry GIS에서 3차원 지형 표현에서 유용하게 사용된다.
    //     //const geometry = new Three.PlaneGeometry(1, 1.4, 2, 3);

    //     // TorusGeometry 객체를 생성하는데 필요한 인자
    //     // Torus 반지름, 튜브 반지름, 방사방향 분할수, 긴원통에 대한 분할수, Torus 구성각도
    //     //const geometry = new Three.TorusGeometry(0.9, 0.4, 24, 32, Math.PI);

    //     // TorusKnotGeometry : 활용도는 떨어진다.
    //     const geometry = new Three.TorusKnotGeometry(0.6, 0.1, 64, 32, 3, 4);
    //     const fillMaterial = new Three.MeshPhongMaterial({ color: 0x515151 });
    //     const cube = new Three.Mesh(geometry, fillMaterial);

    //     // 노란색 선 Material 생성
    //     const lineMaterial = new Three.LineBasicMaterial({ color: 0xffff00 });
    //     // 노란색 선 Material과 생성했던 큐브 geometry를 이용하여 LineSegments 객체 생성
    //     // WireframeGeometry를 적용해야 모델의 모든 외곽선이 정상적으로 표시된다.
    //     const line = new Three.LineSegments(new Three.WireframeGeometry(geometry), lineMaterial);

    //     // Mesh 객체와 LineSegment 객체를 하나로 다루기위해 Group 객체로 묶는다.
    //     const group = new Three.Group();
    //     group.add(cube);
    //     group.add(line);

    //     // 생성한 Group를 Scene 객체에 구가
    //     this._scene.add(group);
    //     // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
    //     this._cube = group;
    // }

    ///////////////////////////////////////////////////////////////////////////////////
    // // Shape 클래스를 이용하여 사각형 그리는 _setupModel 메서드
    // _setupModel() {
    //     // Shape 객체 생성해서 사각형 모양 그리기
    //     const shape = new Three.Shape();
    //     shape.moveTo(1, 1);
    //     shape.lineTo(1, -1);
    //     shape.lineTo(-1, -1);
    //     shape.lineTo(-1, 1);
    //     shape.closePath();

    //     // BufferGeometry를 생성하고 Shape 객체에서 Point들을 가져와 설정
    //     const geometry = new Three.BufferGeometry();
    //     const points = shape.getPoints();
    //     geometry.setFromPoints(points);

    //     // LineBasicMaterial로 Line 색 설정
    //     const material = new Three.LineBasicMaterial({ color: 0xffff00 });
    //     // BufferGeometry와 LineBasicMaterial로 Line 객체를 생성한다.
    //     const line = new Three.Line(geometry, material);

    //     // 생성한 Line 객체 Scene에 추가
    //     this._scene.add(line);
    // }


    /////////////////////////////////////////////////////////////////////////////////
    // // Curve 클래스를 이해하기 위해, Sin그래프를 표현하는 _setupModel 메서드
    // _setupModel() {
    //     // Curve 클래스를 상속받은 CustomSinCurve 정의
    //     class CustomSinCurve extends Three.Curve {
    //         constructor(scale) {
    //             super();
    //             this.scale = scale;
    //         }
    //         getPoint(t) {
    //             const tx = t * 3 - 1.5;
    //             const ty = Math.sin(2 * Math.PI * t);
    //             const tz = 0;
    //             return new Three.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    //         }
    //     }

    //     const path = new CustomSinCurve(4);

    //     // BufferGeometry를 생성하고 CustomSinCurve 객체에서 Point들을 가져와 설정
    //     const geometry = new Three.BufferGeometry();
    //     // Curve를 구성하는 좌표의 개수를 크게 설정할 수록 좀 더 부드러운 선이 그려진다.
    //     const points = path.getPoints(50);
    //     geometry.setFromPoints(points);

    //     // LineBasicMaterial로 Line 색 설정
    //     const material = new Three.LineBasicMaterial({ color: 0xffff00 });
    //     // BufferGeometry와 LineBasicMaterial로 Line 객체를 생성한다.
    //     const line = new Three.Line(geometry, material);

    //     // 생성한 Line 객체 Scene에 추가
    //     this._scene.add(line);
    // }


    ////////////////////////////////////////////////////////////////////////////////////
    // Curve를 상속받은 CustomSinCurve 객체를 인자로, TubeGeometry를 생성하여 Mesh를 구성하는 _setupModel 메서드
    // _setupModel() {
    //     // Curve 클래스를 상속받은 CustomSinCurve 정의
    //     class CustomSinCurve extends Three.Curve {
    //         constructor(scale) {
    //             super();
    //             this.scale = scale;
    //         }
    //         getPoint(t) {
    //             const tx = t * 3 - 1.5;
    //             const ty = Math.sin(2 * Math.PI * t);
    //             const tz = 0;
    //             return new Three.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    //         }
    //     }

    //     const path = new CustomSinCurve(4);

    //     // Curve를 상속받은 CustomSinCurve 객체를 인자로 TubeGeometry를 생성한다.
    //     const geometry = new Three.TubeGeometry(path);

    //     // TubeGeometry 객체와 MeshPhongMaterial 객체를 이용하여 Mesh 객체 생성
    //     const fillMaterial = new Three.MeshPhongMaterial({ color: 0x515151 });
    //     const tube = new Three.Mesh(geometry, fillMaterial);

    //     // 노란색 선 Material 생성
    //     const lineMaterial = new Three.LineBasicMaterial({ color: 0xffff00 });
    //     // 노란색 선 Material과 생성했던 큐브 geometry를 이용하여 LineSegments 객체 생성
    //     // WireframeGeometry를 적용해야 모델의 모든 외곽선이 정상적으로 표시된다.
    //     const line = new Three.LineSegments(new Three.WireframeGeometry(geometry), lineMaterial);

    //     // Mesh 객체와 LineSegment 객체를 하나로 다루기위해 Group 객체로 묶는다.
    //     const group = new Three.Group();
    //     group.add(tube);
    //     group.add(line);

    //     // 생성한 Group를 Scene 객체에 구가
    //     this._scene.add(group);
    //     // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
    //     this._tube = group;
    // }


    ////////////////////////////////////////////////////////////////////////////////////
    // Vector2 배열을 이용하여 LatheGeometry 생성, Mesh를 구성하는 _setupModel 메서드
    _setupModel() {
        const points = [];
        for (let i = 0; i < 10; ++i) {
            points.push(new Three.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8));
        }

        // Vector2 배열을 이용하여 LatheGeometry를 생성한다.
        const geometry = new Three.LatheGeometry(points);

        // LatheGeometry 객체와 MeshPhongMaterial 객체를 이용하여 Mesh 객체 생성
        const fillMaterial = new Three.MeshPhongMaterial({ color: 0x515151 });
        const lathe = new Three.Mesh(geometry, fillMaterial);

        // 노란색 선 Material 생성
        const lineMaterial = new Three.LineBasicMaterial({ color: 0xffff00 });
        // 노란색 선 Material과 생성했던 큐브 geometry를 이용하여 LineSegments 객체 생성
        // WireframeGeometry를 적용해야 모델의 모든 외곽선이 정상적으로 표시된다.
        const line = new Three.LineSegments(new Three.WireframeGeometry(geometry), lineMaterial);

        // Mesh 객체와 LineSegment 객체를 하나로 다루기위해 Group 객체로 묶는다.
        const group = new Three.Group();
        group.add(lathe);
        group.add(line);

        // 생성한 Group를 Scene 객체에 구가
        this._scene.add(group);
        // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
        this._lathe = group;
    }


    _setupControls() {
        // OrbitControls 객체를 생성하기 위해서는 Camera 객체와 마우스 이벤트를 받는 DOM 요소가 필요하다.
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
        // 시간값으로 큐브 회전
        //this._cube.rotation.x = time;
        //this._cube.rotation.y = time;
    }
}

window.onload = function () {
    new App();
}
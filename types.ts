export interface PlasmaParams {
  timeScale: number;
  rotationSpeedX: number;
  rotationSpeedY: number;
  plasmaScale: number;
  plasmaBrightness: number;
  voidThreshold: number;
  colorDeep: string;
  colorMid: string;
  colorBright: string;
  shellColor: string;
  shellOpacity: number;
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
}

export interface ShaderUniforms {
  [key: string]: { value: any };
}

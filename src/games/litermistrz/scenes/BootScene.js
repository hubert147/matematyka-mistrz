// BootScene — ekran ładowania, inicjalizacja

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    const W = this.scale.width
    const H = this.scale.height

    // Tło
    this.add.rectangle(W / 2, H / 2, W, H, 0xEEF4FF)

    // Sowa ładowania
    const owl = this.add.text(W / 2, H / 2 - 80, '🦉', {
      fontSize: '80px',
    }).setOrigin(0.5)

    // Animacja sowy
    this.tweens.add({
      targets: owl,
      y: H / 2 - 100,
      duration: 800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    })

    // Tekst ładowania
    this.add.text(W / 2, H / 2 + 30, 'Pani Sowa przygotowuje lekcję...', {
      fontSize: '18px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#5D6D7E',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // Pasek postępu — tło
    const barBg = this.add.graphics()
    barBg.fillStyle(0xD5DBDB, 1)
    barBg.fillRoundedRect(W / 2 - 150, H / 2 + 80, 300, 18, 9)

    // Pasek postępu — wypełnienie
    const bar = this.add.graphics()

    this.load.on('progress', (value) => {
      bar.clear()
      bar.fillStyle(0xF39C12, 1)
      bar.fillRoundedRect(W / 2 - 150, H / 2 + 80, 300 * value, 18, 9)
    })

    // Załaduj obrazki liter
    const letterImages = [
      ['img_a',        '/images/letters/a_arbuz.png'],
      ['img_b',        '/images/letters/b_banan.png'],
      ['img_c',        '/images/letters/c_cytryna.png'],
      ['img_d',        '/images/letters/d_dom.png'],
      ['img_e',        '/images/letters/e_ekran.png'],
      ['img_f',        '/images/letters/f_foka.png'],
      ['img_g',        '/images/letters/g_gitara.png'],
      ['img_h',        '/images/letters/h_herbata.png'],
      ['img_i',        '/images/letters/i_igla.png'],
      ['img_j',        '/images/letters/j_jablko.png'],
      ['img_k',        '/images/letters/k_kot.png'],
      ['img_l',        '/images/letters/l_lew.png'],
      ['img_lodka',    '/images/letters/l_lodka.png'],
      ['img_m',        '/images/letters/m_mis.png'],
      ['img_n',        '/images/letters/n_noga.png'],
      ['img_o',        '/images/letters/o_osa.png'],
      ['img_p',        '/images/letters/p_pies.png'],
      ['img_r',        '/images/letters/r_rower.png'],
      ['img_s',        '/images/letters/s_slon.png'],
      ['img_t',        '/images/letters/t_torba.png'],
      ['img_u',        '/images/letters/u_ucho.png'],
      ['img_w',        '/images/letters/w_woda.png'],
      ['img_z',        '/images/letters/z_zebra.png'],
      ['img_a_zab',    '/images/letters/a_zab.png'],
      ['img_c_cma',    '/images/letters/c_cma.png'],
      ['img_n_kon',    '/images/letters/n_kon.png'],
      ['img_o_osemka', '/images/letters/o_osemka.png'],
      ['img_s_slimak', '/images/letters/s_slimak.png'],
      ['img_z_zrodlo', '/images/letters/z_zrodlo.png'],
      ['img_z_zaba',   '/images/letters/z_zaba.png'],
    ]
    letterImages.forEach(([key, path]) => this.load.image(key, path))
  }

  create() {
    // Krótkie opóźnienie dla efektu
    this.time.delayedCall(400, () => {
      this.scene.start('MenuScene')
    })
  }
}

import { describe, expect, it } from 'vitest'
import { appointmentsCsv, visitsOf } from './history'
import type { Appointment, Service } from './types'

const car = (over: Partial<Appointment>): Appointment => ({
  id: 'a',
  plate: 'ABC1D23',
  model: 'Gol',
  color: 'Prata',
  serviceId: 's1',
  date: '2026-10-01',
  time: '09:00',
  valueCents: 5000,
  status: 'pago',
  payMethod: 'pix',
  ...over,
})
const services = [{ id: 's1', name: 'Lavagem "Simples"; completa' }] as Service[]

describe('histórico por placa', () => {
  it('conta as visitas e devolve a mais recente', () => {
    const list = [car({ id: '1', date: '2026-09-10' }), car({ id: '2', date: '2026-10-05', time: '08:00' }), car({ id: '3', plate: 'ZZZ9Y88' })]
    const v = visitsOf(list, 'ABC1D23')
    expect(v?.count).toBe(2)
    expect(v?.last.id).toBe('2')
    expect(visitsOf(list, 'XXX0X00')).toBeNull()
  })
})

describe('planilha dos dados', () => {
  it('usa ; e vírgula decimal, com BOM, e protege aspas e ponto e vírgula', () => {
    const csv = appointmentsCsv([car({})], services)
    expect(csv.startsWith('﻿Data;Hora;')).toBe(true)
    expect(csv).toContain('01/10/2026;09:00;ABC1D23;Gol;Prata;"Lavagem ""Simples""; completa";50,00;Pago;Pix')
  })

  it('deixa o pagamento vazio quando ainda não pagou e ordena por data', () => {
    const csv = appointmentsCsv([car({ id: 'b', date: '2026-10-02', status: 'pronto', payMethod: undefined }), car({ id: 'a' })], services)
    const lines = csv.trim().split('\r\n')
    expect(lines[1]).toContain('01/10/2026')
    expect(lines[2].endsWith(';Pronto;')).toBe(true)
  })
})

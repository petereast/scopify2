package scopify.work.backend.infrastructure

import com.github.salomonbrys.kotson.fromJson
import com.google.gson.Gson
import redis.clients.jedis.JedisPool
import redis.clients.jedis.JedisPoolConfig
import scopify.work.backend.model.IScopeRepository
import scopify.work.backend.model.ScopeSession
import java.net.URI
import java.time.Duration

private val pool: JedisPool = createJedisPool()

class RedisDal() : IScopeRepository {
    // Expire after 24 Hours
    private val expiry = 60 * 60 * 24

    private fun sessionKey(id: String) = "session:$id"

    private fun setExpiry(id: String) = pool.resource.use { pool -> pool.expire(sessionKey(id), expiry) }

    override fun getSession(id: String): ScopeSession? {

        pool.resource.use { pool ->
            val session = Gson().fromJson<ScopeSession>(pool.get(sessionKey(id)) ?: return null)
            setExpiry(id)
            return session
        }
    }

    override fun writeSession(session: ScopeSession) {
        pool.resource.use { pool ->
            val sessionJson = Gson().toJson(session)
            pool.set(sessionKey(session.id), sessionJson)
            setExpiry(session.id)
        }
    }
}

fun createJedisPool(): JedisPool {
    val redisUrl = URI.create(System.getenv("REDIS_URL") ?: "redis://localhost:6379")

    val poolConfig = JedisPoolConfig()
    poolConfig.maxTotal = 10
    poolConfig.maxIdle = 5
    poolConfig.testOnBorrow = true
    poolConfig.testOnReturn = true
    poolConfig.testWhileIdle = true

    return JedisPool(poolConfig, redisUrl)
}
